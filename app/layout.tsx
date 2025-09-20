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
  description: `Бренд «УстА» — это место, где одежда становится искусством, — способом самовыражения. Мы создаём уникальные образы, вдохновлённые культурными корнями, разными эпохами, событиями прошедшего времени и современностью. Ведь мода это всегда отражение жизни и личности, не случайно народная мудрость гласит:- " По одежке встречают"... Здесь мы переосмысляем моду, соединяя прошлое и настоящее. Вдохновляйтесь вместе с нами и меняйте мир через стиль!`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${cyrillicOld.variable} antialiased bg-[oklch(25.8%_0.132_29.4)]`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
