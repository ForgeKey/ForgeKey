import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { KeystoreProvider } from '@/contexts/keystore-context';
import { ZeroizeProvider } from '@/contexts/zeroize-context';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ZeroizeProvider>
      <KeystoreProvider>
        <Component {...pageProps} />
      </KeystoreProvider>
    </ZeroizeProvider>
  );
}
