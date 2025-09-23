'use client';

import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui';

export default function Contacts() {
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
    <address className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-lg sm:text-xl">
      {/* ВКонтакте */}
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://vk.com/butikusta?from=groups"
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label="Группа ВКонтакте"
            aria-describedby="tooltip-vk"
            className={commonClasses}
          >
            <Image
              src="/icons/vk.svg"
              alt="Иконка ВКонтакте"
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="text-stone-300">ВКонтакте</span>
          </a>
        </TooltipTrigger>
        <TooltipContent id="tooltip-vk">
          <p>Группа ВКонтакте</p>
        </TooltipContent>
      </Tooltip>

      {/* Email */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Скопировать почтовый адрес"
            aria-describedby="tooltip-email"
            onClick={() => handleCopy('to-zlato@mail.ru')}
            className={commonClasses}
          >
            <Mail
              color="oklch(86.9% 0.005 56.366)"
              size={28}
              aria-hidden="true"
              className="shrink-0"
            />
            <span className="text-stone-300">to-zlato@mail.ru</span>
          </button>
        </TooltipTrigger>
        <TooltipContent id="tooltip-email">
          <p>Скопировать почтовый адрес</p>
        </TooltipContent>
      </Tooltip>

      {/* Телефон */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Скопировать номер телефона"
            aria-describedby="tooltip-phone"
            onClick={() => handleCopy('+7 (905) 205-25-50')}
            className={commonClasses}
          >
            <Phone
              color="oklch(86.9% 0.005 56.366)"
              size={28}
              aria-hidden="true"
              className="shrink-0"
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
