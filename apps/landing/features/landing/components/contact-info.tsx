'use client';

import { Button } from '@usta/ui/components/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@usta/ui/components/tooltip';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactInfo() {
  const handleCopy = async (text: string) => {
    const { toast } = await import('sonner');

    try {
      await navigator.clipboard.writeText(text);

      toast.success(`${text} успешно скопирован`, {
        duration: 2500,
        position: 'top-center',
      });
    } catch {
      toast.error('Ошибка', {
        description: 'Не удалось скопировать',
      });
    }
  };

  return (
    <address className='flex flex-col items-center justify-center gap-4 text-lg sm:flex-row sm:gap-6 sm:text-xl'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            aria-describedby='tooltip-vk'
            aria-label='Группа ВКонтакте'
            href='https://vk.com/butikusta?from=groups'
            rel='noopener noreferrer nofollow'
            target='_blank'
          >
            <Button
              variant={'link'}
              size={'xl'}
            >
              <Image
                alt='Иконка ВКонтакте'
                className='shrink-0'
                height={24}
                src='/icons/vk.svg'
                width={24}
              />
              <span>ВКонтакте</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent id='tooltip-vk'>
          <p>Группа ВКонтакте</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'link'}
            size={'xl'}
            aria-describedby='tooltip-email'
            aria-label='Скопировать почтовый адрес'
            onClick={() => handleCopy('to-zlato@mail.ru')}
            type='button'
          >
            <Mail
              aria-hidden='true'
              className='shrink-0'
              size={24}
            />
            <span>to-zlato@mail.ru</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent id='tooltip-email'>
          <p>Скопировать почтовый адрес</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={'link'}
            size={'xl'}
            aria-describedby='tooltip-phone'
            aria-label='Скопировать номер телефона'
            onClick={() => handleCopy('+7 (905) 205-25-50')}
            type='button'
          >
            <Phone
              aria-hidden='true'
              className='shrink-0'
              size={24}
            />
            <span>+7 (905) 205-25-50</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent id='tooltip-phone'>
          <p>Скопировать номер телефона</p>
        </TooltipContent>
      </Tooltip>
    </address>
  );
}
