// components/shared/ThemeToggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm font-medium bg-white/70 dark:bg-slate-800/70 text-gray-700 dark:text-slate-100 shadow-sm hover:shadow-md transition-all"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
};
