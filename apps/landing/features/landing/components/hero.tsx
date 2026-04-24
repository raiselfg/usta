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
        loading="eager"
        priority
        sizes="100vw"
        src="/images/backgrounds/background.jpeg"
        style={{ objectFit: 'cover' }}
      />
      <Image
        alt="Логотип бренда УстА"
        className="slide-up absolute"
        height={400}
        loading="eager"
        priority
        src="/images/backgrounds/logo.png"
        width={400}
      />
    </header>
  );
}
