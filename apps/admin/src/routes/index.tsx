import { createFileRoute, Navigate } from '@tanstack/react-router';
import { Spinner } from '@usta/ui/components/spinner';

import { SignInForm } from '@/components/signin-form';
import { useSession } from '@/lib/auth-client';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (data?.session) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
}
