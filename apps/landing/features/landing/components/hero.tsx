import Image from 'next/image';

export default function Hero() {
  return (
    <header className="relative mx-auto flex h-screen w-full max-w-[1920px] items-center justify-center">
      <h1 className="sr-only">
        УстА — студия дизайна одежды и головных уборов
      </h1>
      <Image
        src="/images/backgrounds/background.jpeg"
        alt="Фоновое изображение заголовка"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        priority
        loading="eager"
      />
      <Image
        src="/images/backgrounds/logo.png"
        alt="Логотип бренда УстА"
        width={400}
        height={400}
        className="slide-up absolute"
        priority
        loading="eager"
      />
    </header>
  );
}
