'use client';

import { useEffect } from 'react';
import { Button } from '@usta/ui/components/button';

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
        <Button variant="outline" onClick={() => reset()}>
          Попробовать снова
        </Button>
        <Button
          variant="secondary"
          onClick={() => (window.location.href = '/')}
        >
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
