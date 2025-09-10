'use client';

import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { toast } from 'sonner';

interface Contact {
  id: string;
  href?: string;
  label: string;
  tooltip: string;
  icon: React.ReactNode;
  external?: boolean;
  copy?: boolean;
}

const contacts: Contact[] = [
  {
    id: 'vk',
    href: 'https://vk.com/butikusta?from=groups',
    label: 'ВКонтакте',
    tooltip: 'Группа ВКонтакте',
    icon: (
      <Image
        src="/icons/vk.svg"
        alt="Иконка ВКонтакте"
        width={28}
        height={28}
        className="shrink-0"
      />
    ),
    external: true,
  },
  {
    id: 'email',
    label: 'to-zlato@mail.ru',
    tooltip: 'Скопировать почтовый адрес',
    icon: <Mail size={28} aria-hidden="true" className="shrink-0" />,
    copy: true,
  },
  {
    id: 'phone',
    label: '+7 (905) 205-25-50',
    tooltip: 'Скопировать номер телефона',
    icon: <Phone size={28} aria-hidden="true" className="shrink-0" />,
    copy: true,
  },
];

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
      {contacts.map(({ id, href, label, tooltip, icon, external, copy }) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            {copy ? (
              <button
                type="button"
                aria-label={`Скопировать ${label}`}
                aria-describedby={`tooltip-${id}`}
                onClick={() => handleCopy(label)}
                className={commonClasses}
              >
                {icon}
                <span>{label}</span>
              </button>
            ) : (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer nofollow' : 'nofollow'}
                aria-label={tooltip}
                aria-describedby={`tooltip-${id}`}
                className={commonClasses}
              >
                {icon}
                <span>{label}</span>
              </a>
            )}
          </TooltipTrigger>
          <TooltipContent id={`tooltip-${id}`}>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </address>
  );
}
