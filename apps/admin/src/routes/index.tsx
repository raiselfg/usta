import { createFileRoute, redirect } from '@tanstack/react-router';
import { Spinner } from '@usta/ui/components/spinner';

import { SignInForm } from '@/shared/components/signin-form';
import { authClient } from '@/shared/lib/auth-client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { data } = await authClient.getSession();
    if (data?.session) {
      throw redirect({ to: '/dashboard' });
    }
  },
  pendingComponent: () => (
    <div className='flex h-screen items-center justify-center'>
      <Spinner />
    </div>
  ),
  component: Index,
});

function Index() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <SignInForm />
    </div>
  );
}
