import type { ComponentProps } from 'react';

import { Link } from '@tanstack/react-router';
import { Separator } from '@usta/ui/components/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@usta/ui/components/sidebar';

import { ThemeToggle } from './theme-toggle';

const data = {
  navMain: [
    {
      title: 'Главная',
      url: '/dashboard',
      items: [
        {
          title: 'Категории товаров',
          url: '/dashboard/product-categories',
        },
        {
          title: 'Товары',
          url: '/dashboard/products',
        },
      ],
    },
  ],
};

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar
      {...props}
      className='border-border bg-card border-r'
    >
      <SidebarContent className='p-2'>
        {data.navMain.map(group => (
          <SidebarGroup
            key={group.title}
            className='flex flex-col gap-2 py-4'
          >
            <SidebarGroupLabel className='px-4 font-black tracking-widest'>
              <div className='flex w-full items-center justify-between'>
                <Link
                  className='text-lg'
                  to={group.url}
                >
                  {group.title}
                </Link>
                <ThemeToggle />
              </div>
            </SidebarGroupLabel>
            <Separator />
            <SidebarGroupContent>
              <SidebarMenu className='flex flex-col gap-1'>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className='hover:bg-muted/50 group relative h-11 px-4 transition-all duration-300'
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false);
                        }
                      }}
                    >
                      <Link
                        to={item.url}
                        activeProps={{
                          className: 'bg-primary/5 text-primary ',
                        }}
                      >
                        <span className='group-[.active]:text-primary font-bold tracking-widest transition-colors'>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
