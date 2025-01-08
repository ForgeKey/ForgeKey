import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { KeystoreProvider } from '@/contexts/KeystoreContext';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <KeystoreProvider>
      <Component {...pageProps} />
    </KeystoreProvider>
  );
}
