import Image from 'next/image';

export default function Hero() {
  return (
    <header className="relative mx-auto flex h-screen w-full items-center justify-center">
      <h1 className="sr-only">
        УстА — студия дизайна одежды и головных уборов
      </h1>

      <Image
        alt="Фоновое изображение заголовка"
        className="object-cover"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        src="/images/backgrounds/background.avif"
      />

      <Image
        alt="Логотип бренда УстА"
        className="slide-up absolute z-10"
        fetchPriority="high"
        height={400}
        priority
        quality={50}
        src="/images/backgrounds/logo.avif"
        width={400}
      />
    </header>
  );
}
