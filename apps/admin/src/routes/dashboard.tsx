import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@usta/ui/components/sidebar';
import { Spinner } from '@usta/ui/components/spinner';

import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (!data?.session) {
      throw redirect({ to: '/' });
    }
  },
  pendingComponent: () => (
    <div className='flex h-screen items-center justify-center'>
      <Spinner />
    </div>
  ),
  component: Dashboard,
});

function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden'>
          <SidebarTrigger />
        </header>
        <main className='flex flex-1 flex-col px-4'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
