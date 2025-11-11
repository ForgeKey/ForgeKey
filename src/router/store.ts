import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Route } from './types';
import { ROUTES } from './types';

interface RouterState {
  currentRoute: Route;
  history: Route[];
  navigate: <T extends Route>(route: T) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  reset: () => void;
}

/**
 * Main router store using Zustand
 * Manages navigation state and history
 */
export const useRouter = create<RouterState>()(
  devtools(
    (set, get) => ({
      currentRoute: { name: ROUTES.KEYSTORE_LIST },
      history: [],

      navigate: (route) =>
        set((state) => {
          // Don't add to history if navigating to the same route
          if (
            state.currentRoute.name === route.name &&
            JSON.stringify(state.currentRoute) === JSON.stringify(route)
          ) {
            return state;
          }

          return {
            currentRoute: route,
            history: [...state.history, state.currentRoute],
          };
        }),

      goBack: () =>
        set((state) => {
          if (state.history.length === 0) return state;

          const previous = state.history[state.history.length - 1];
          return {
            currentRoute: previous,
            history: state.history.slice(0, -1),
          };
        }),

      canGoBack: () => get().history.length > 0,

      reset: () =>
        set({
          currentRoute: { name: ROUTES.KEYSTORE_LIST },
          history: [],
        }),
    }),
    { name: 'Router' }
  )
);
