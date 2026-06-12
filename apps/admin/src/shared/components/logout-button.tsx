import { useNavigate } from '@tanstack/react-router';
import { Button } from '@usta/ui/components/button';
import { toast } from 'sonner';

import { signOut } from '../lib/auth-client';

export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Вы успешно вышли из аккаунта');
      await navigate({ to: '/' });
    } catch {
      toast.error('Ошибка при выходе из аккаунта');
    }
  };
  return <Button onClick={handleLogout}>Выйти</Button>;
}
