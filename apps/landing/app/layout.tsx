import './globals.css';

import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

import { Toaster } from '@usta/ui/components/sonner';
import { TooltipProvider } from '@usta/ui/components/tooltip';

const cyrillicOld = localFont({
  src: '../fonts/CyrillicOld.woff2',
  variable: '--font-cyrillic-old',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'УстА — Студия дизайна одежды и головных уборов',
    template: '%s | УстА',
  },
  description: `Бренд «УстА» — это место, где одежда становится искусством — способом самовыражения. Вдохновляйтесь вместе с нами и меняйте мир через стиль!`,
  openGraph: {
    title: 'УстА — Студия дизайна одежды и головных уборов',
    description: 'Переосмысляем моду, соединяя прошлое и настоящее. Уникальные образы, вдохновлённые культурными корнями.',
    url: 'https://us-ta.ru',
    siteName: 'УстА',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/images/backgrounds/logo.png',
        width: 800,
        height: 800,
        alt: 'Логотип УстА',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${cyrillicOld.variable} bg-[oklch(25.8%_0.132_29.4)] antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
