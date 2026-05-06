import { Link } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@usta/ui/components/sidebar';
import * as React from 'react';

const data = {
  navMain: [
    {
      title: 'Разделы',
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

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar {...props} className="border-border bg-card border-r">
      <SidebarHeader className="border-border border-b p-4">
        <span className="text-foreground font-black tracking-[0.2em] uppercase">
          Админ панель
        </span>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title} className="py-4">
            <SidebarGroupLabel className="text-muted-foreground/50 px-4 text-[10px] font-black tracking-[0.3em] uppercase">
              <Link to={group.url}>{group.title}</Link>
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-muted/50 group relative h-11 px-4 transition-all duration-300"
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
                        <span className="group-[.active]:text-primary text-[11px] font-bold tracking-widest uppercase transition-colors">
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
