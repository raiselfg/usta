'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@usta/ui/components/tooltip';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContactInfo() {
  const handleCopy = async (text: string) => {
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

  const commonClasses =
    'flex items-center gap-2 text-primary hover:underline transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-md';

  return (
    <address className="flex flex-col items-center justify-center gap-4 text-lg sm:flex-row sm:gap-6 sm:text-xl">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            aria-describedby="tooltip-vk"
            aria-label="Группа ВКонтакте"
            className={commonClasses}
            href="https://vk.com/butikusta?from=groups"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            <Image
              alt="Иконка ВКонтакте"
              className="shrink-0"
              height={28}
              src="/icons/vk.svg"
              width={28}
            />
            <span className="text-stone-300">ВКонтакте</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent id="tooltip-vk">
          <p>Группа ВКонтакте</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-describedby="tooltip-email"
            aria-label="Скопировать почтовый адрес"
            className={commonClasses}
            onClick={() => handleCopy('to-zlato@mail.ru')}
            type="button"
          >
            <Mail
              aria-hidden="true"
              className="shrink-0"
              color="oklch(86.9% 0.005 56.366)"
              size={28}
            />
            <span className="text-stone-300">to-zlato@mail.ru</span>
          </button>
        </TooltipTrigger>
        <TooltipContent id="tooltip-email">
          <p>Скопировать почтовый адрес</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-describedby="tooltip-phone"
            aria-label="Скопировать номер телефона"
            className={commonClasses}
            onClick={() => handleCopy('+7 (905) 205-25-50')}
            type="button"
          >
            <Phone
              aria-hidden="true"
              className="shrink-0"
              color="oklch(86.9% 0.005 56.366)"
              size={28}
            />
            <span className="text-stone-300">+7 (905) 205-25-50</span>
          </button>
        </TooltipTrigger>
        <TooltipContent id="tooltip-phone">
          <p>Скопировать номер телефона</p>
        </TooltipContent>
      </Tooltip>
    </address>
  );
}
