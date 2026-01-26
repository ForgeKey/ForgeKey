import { useState, useEffect, useCallback } from 'react';
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'ready'
  | 'error';

interface UpdateState {
  status: UpdateStatus;
  update: Update | null;
  progress: number;
  error: string | null;
}

export function useUpdater() {
  const [state, setState] = useState<UpdateState>({
    status: 'idle',
    update: null,
    progress: 0,
    error: null,
  });

  const checkForUpdates = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'checking', error: null }));

    try {
      const update = await check();

      if (update) {
        setState(prev => ({
          ...prev,
          status: 'available',
          update,
        }));
        return true;
      } else {
        setState(prev => ({ ...prev, status: 'idle' }));
        return false;
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to check for updates',
      }));
      return false;
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    if (!state.update) return;

    setState(prev => ({ ...prev, status: 'downloading', progress: 0 }));

    try {
      let downloaded = 0;
      let contentLength = 0;

      await state.update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            contentLength = event.data.contentLength ?? 0;
            break;
          case 'Progress':
            downloaded += event.data.chunkLength;
            if (contentLength > 0) {
              const progress = Math.round((downloaded / contentLength) * 100);
              setState(prev => ({ ...prev, progress }));
            }
            break;
          case 'Finished':
            setState(prev => ({ ...prev, status: 'ready', progress: 100 }));
            break;
        }
      });

      // Relaunch the app to apply the update
      await relaunch();
    } catch (error) {
      console.error('Failed to download/install update:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to install update',
      }));
    }
  }, [state.update]);

  const dismissUpdate = useCallback(() => {
    setState({
      status: 'idle',
      update: null,
      progress: 0,
      error: null,
    });
  }, []);

  // Check for updates on mount (only in production)
  useEffect(() => {
    // Skip update check in development
    if (process.env.NODE_ENV === 'development') return;

    // Delay initial check to not block app startup
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 3000);

    return () => clearTimeout(timer);
  }, [checkForUpdates]);

  return {
    ...state,
    checkForUpdates,
    downloadAndInstall,
    dismissUpdate,
    version: state.update?.version ?? null,
    currentVersion: state.update?.currentVersion ?? null,
  };
}
