'use client';

import { Button } from '@usta/ui/components/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center text-stone-300">
      <h2 className="text-4xl font-bold">Упс! Что-то пошло не так.</h2>
      <p className="max-w-md text-lg">
        Произошла непредвиденная ошибка при загрузке страницы. Пожалуйста,
        попробуйте обновить или вернуться позже.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="outline">
          Попробовать снова
        </Button>
        <Button
          onClick={() => (window.location.href = '/')}
          variant="secondary"
        >
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
