import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { Toaster } from '@usta/ui/components/sonner';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';
import './globals.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-center" duration={3500} />
      </QueryClientProvider>
    </StrictMode>,
  );
}
