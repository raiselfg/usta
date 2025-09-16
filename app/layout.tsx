import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/shared/components/ui/sonner';

const cyrillicOld = localFont({
  src: '../public/fonts/CyrillicOld.woff2',
  variable: '--font-cyrillic-old',
});

export const metadata: Metadata = {
  title: {
    absolute: 'УстА',
    template: '$s | УстА',
  },
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cyrillicOld.variable} antialiased bg-[oklch(25.8%_0.132_29.4)]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
