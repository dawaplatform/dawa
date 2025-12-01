import { Poppins } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/layout/ClientProviders';
import { generateDefaultMetadata } from '@/@core/utils/seo';
import mainConfig from '@/@core/configs/mainConfigs';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = generateDefaultMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={mainConfig.usedLocale}>
      <body className={`${poppins.className} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
