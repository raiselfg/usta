import { Toaster } from '@usta/ui/components/sonner';
import { StrictMode } from 'react';

import './globals.css';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" duration={3500} />
  </StrictMode>,
);
