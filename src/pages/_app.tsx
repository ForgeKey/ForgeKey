import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { KeystoreProvider } from '@/contexts/keystore-context';
import { ThemeProvider } from '@/contexts/theme-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <KeystoreProvider>
        <Component {...pageProps} />
      </KeystoreProvider>
    </ThemeProvider>
  );
}
