import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full h-screen max-w-[1920px] mx-auto relative flex justify-center items-center">
      <Image
        src="/images/backgrounds/bg.JPEG"
        alt="Фоновое изображение заголовка"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <Image
        src="/images/backgrounds/logo.png"
        alt="logo"
        width={400}
        height={400}
        className="absolute slide-up"
        aria-label="Название бренда УстА"
      />
    </header>
  );
}
