import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import { ZeroizeProvider } from '@/contexts/zeroize-context';
import { UpdateDialog } from '@/components/update-dialog';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ZeroizeProvider>
      <Component {...pageProps} />
      <UpdateDialog />
    </ZeroizeProvider>
  );
}
