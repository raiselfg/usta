import { createFileRoute, Navigate } from '@tanstack/react-router';
import { Spinner } from '@usta/ui/components/spinner';

import { useSession } from '@/lib/auth-client';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data?.session) {
    return <Navigate to="/" />;
  }

  return <div className="p-2">Hello from Dashboard! {data.user.name}</div>;
}
