import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { KeystoreProvider } from '@/contexts/keystore-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { useEffect, useState } from 'react';
import { initZeroizeModule } from '@/utils/zeroize';

export default function App({ Component, pageProps }: AppProps) {
  const [isZeroizeInitialized, setIsZeroizeInitialized] = useState(false);

  // Initialize the zeroize module when the app starts
  useEffect(() => {
    // Initialize the WebAssembly zeroize module
    initZeroizeModule()
      .then(() => {
        console.log('Zeroize module initialized successfully');
        setIsZeroizeInitialized(true);
      })
      .catch((error) => {
        console.error('Failed to initialize zeroize module:', error);
        // Continue anyway, but with a warning
        setIsZeroizeInitialized(true);
      });
  }, []);

  // Show loading state while initializing
  if (!isZeroizeInitialized) {
    return <div>Loading secure modules...</div>;
  }

  return (
    <ThemeProvider>
      <KeystoreProvider>
        <Component {...pageProps} />
      </KeystoreProvider>
    </ThemeProvider>
  );
}
