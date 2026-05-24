import { Moon, Sun } from 'lucide-react';

import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => (theme === 'dark' ? setTheme('light') : setTheme('dark'))}
      className='group bg-muted focus-visible:ring-ring focus-visible:ring-offset-background relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
      aria-label='Toggle theme'
    >
      <span className='sr-only'>Toggle theme</span>

      {/* Background Decor */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden rounded-full bg-linear-to-b from-blue-100/50 to-transparent transition-colors duration-500 dark:from-indigo-950/50 dark:to-transparent'>
        {/* Stars for dark mode */}
        <div className='absolute top-1 left-2 h-0.5 w-0.5 rounded-full bg-white opacity-0 transition-opacity duration-700 dark:opacity-40' />
        <div className='absolute top-3 left-4 h-0.5 w-0.5 rounded-full bg-white opacity-0 transition-opacity duration-700 dark:opacity-60' />
        <div className='absolute top-1 left-7 h-0.5 w-0.5 rounded-full bg-white opacity-0 transition-opacity duration-700 dark:opacity-30' />

        {/* Clouds for light mode */}
        <div className='absolute top-3.5 right-1.5 h-1 w-2 rounded-full bg-white opacity-40 blur-[1px] transition-all duration-700 dark:translate-x-4 dark:opacity-0' />
        <div className='absolute top-1.5 right-4 h-0.5 w-2 rounded-full bg-white opacity-60 blur-[0.5px] transition-all duration-700 dark:translate-x-6 dark:opacity-0' />
      </div>

      <span className='bg-background pointer-events-none relative flex h-4 w-4 translate-x-0.5 items-center justify-center rounded-full shadow-md ring-0 transition-all duration-500 ease-in-out dark:translate-x-6'>
        <div className='absolute inset-0 rounded-full bg-amber-400/20 opacity-100 blur-sm transition-opacity duration-500 dark:opacity-0' />
        <div className='absolute inset-0 rounded-full bg-indigo-400/20 opacity-0 blur-sm transition-opacity duration-500 dark:opacity-100' />

        <Sun
          className='h-3 w-3 scale-100 rotate-0 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] transition-all duration-500 dark:scale-0 dark:-rotate-90'
          strokeWidth={3}
        />
        <Moon
          className='absolute h-3 w-3 scale-0 rotate-90 text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)] transition-all duration-500 dark:scale-100 dark:rotate-0'
          strokeWidth={3}
        />
      </span>

      {/* Interactive Halo */}
      <span className='ring-primary/5 pointer-events-none absolute inset-0 scale-105 rounded-full opacity-0 ring-2 transition-opacity duration-300 group-hover:opacity-100' />
    </button>
  );
}
