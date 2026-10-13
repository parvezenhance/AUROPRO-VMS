import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'pill' | 'minimal';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  variant = 'button',
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        id="btn-theme-toggle"
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center gap-1 p-1 rounded-full border transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-amber-400 hover:border-slate-600'
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'Day' : 'Dark'} mode`}
        title={`Current: ${isDark ? 'Dark Mode' : 'Day Mode'}. Click to switch to ${isDark ? 'Day Mode' : 'Dark Mode'}`}
      >
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
            !isDark ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-500'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </span>
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-200 ${
            isDark ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </span>
        {showLabel && (
          <span className="text-[11px] font-bold px-1.5 tracking-tight">
            {isDark ? 'Dark' : 'Day'}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        id="btn-theme-toggle"
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 cursor-pointer ${
          isDark
            ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'Day' : 'Dark'} mode`}
        title={`Switch to ${isDark ? 'Day Mode' : 'Dark Mode'}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      id="btn-theme-toggle"
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200 hover:border-amber-500/50 hover:shadow-xs'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:shadow-xs'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'Day' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Day Mode' : 'Dark Mode'}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className={`text-[11px] font-semibold ml-1.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {isDark ? 'Day Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
