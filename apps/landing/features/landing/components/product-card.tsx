import Image from 'next/image';

interface Props {
  name: string | null;
  image: string;
  isPriority: boolean;
}

export const ProductCard = ({ name, image, isPriority }: Props) => {
  return (
    <div className='relative'>
      <Image
        alt={name || 'Изображение товара'}
        className='w-full border-2 object-cover'
        priority={isPriority}
        quality={70}
        height={455}
        width={305}
        sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
        src={image}
      />
    </div>
  );
};
