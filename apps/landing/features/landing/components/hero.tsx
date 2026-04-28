import Image from 'next/image';

export default function Hero() {
  return (
    <header className="relative mx-auto flex h-screen w-full max-w-480 items-center justify-center">
      <h1 className="sr-only">
        УстА — студия дизайна одежды и головных уборов
      </h1>

      <Image
        alt="Фоновое изображение заголовка"
        fill
        priority
        quality={60}
        sizes="(max-width: 1920px) 100vw, 1920px"
        src="/images/backgrounds/background.jpeg"
        style={{ objectFit: 'cover' }}
      />

      <Image
        alt="Логотип бренда УстА"
        className="slide-up absolute"
        height={400}
        priority
        quality={80}
        src="/images/backgrounds/logo.png"
        width={400}
      />
    </header>
  );
}
