import { Link, useLocation } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@usta/ui/components/sidebar';
import * as React from 'react';

const data = {
  navMain: [
    {
      title: 'Управление контентом',
      url: '#', // TODO: Замените на реальные пути, например '/dashboard/categories'
      items: [
        {
          title: 'Категории',
          url: '/dashboard/categories',
        },
        {
          title: 'Товары',
          url: '/dashboard/products',
        },
      ],
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Получаем текущий путь из роутера
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  // Проверяем, совпадает ли путь элемента с текущим URL
                  const isActive = pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        {/* Используем Link из @tanstack/react-router вместо <a> */}
                        <Link to={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
