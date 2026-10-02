import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon-only';
  theme?: 'light' | 'dark' | 'mono';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: { title: 'text-base font-bold', sub: 'text-[9px] tracking-widest' },
    md: { title: 'text-lg font-extrabold', sub: 'text-[10px] tracking-widest' },
    lg: { title: 'text-2xl font-black', sub: 'text-xs tracking-[0.2em]' },
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Scientific Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal Precision Shield */}
          <polygon
            points="50,4 90,26 90,74 50,96 10,74 10,26"
            className={isDark ? 'fill-blue-900/60 stroke-blue-400' : 'fill-blue-50 stroke-blue-600'}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Atomic Orbital Ring */}
          <ellipse
            cx="50"
            cy="52"
            rx="32"
            ry="14"
            transform="rotate(-28 50 52)"
            className={isDark ? 'stroke-sky-400/70' : 'stroke-blue-400'}
            strokeWidth="2.2"
            strokeDasharray="4 2.5"
          />

          {/* Erlenmeyer Scientific Flask Silhouette */}
          <path
            d="M 44,22 L 56,22 L 56,36 L 73,70 C 74.5,73 72.5,76 69,76 L 31,76 C 27.5,76 25.5,73 27,70 L 44,36 Z"
            className={isDark ? 'fill-white stroke-blue-200' : 'fill-blue-600 stroke-blue-700'}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Liquid Level & Bubbles inside Flask */}
          <path
            d="M 33,65 C 38,62 45,67 52,64 C 59,61 65,65 67,65 L 69,74 L 31,74 Z"
            className={isDark ? 'fill-sky-400' : 'fill-sky-300'}
          />

          {/* Measurement Graduations */}
          <line x1="49" y1="52" x2="56" y2="52" stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="47" y1="60" x2="57" y2="60" stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="1.5" strokeLinecap="round" />

          {/* Active Valence Electron Dot */}
          <circle cx="75" cy="40" r="3.5" className={isDark ? 'fill-sky-300' : 'fill-blue-500'} />
          <circle cx="25" cy="62" r="2.5" className={isDark ? 'fill-white' : 'fill-sky-400'} />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`${textSizes[size].title} tracking-tight font-sans ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              KASTURI
            </span>
            <span
              className={`${textSizes[size].title} tracking-tight font-sans ${
                isDark ? 'text-sky-400' : 'text-blue-600'
              }`}
            >
              ENTERPRISES
            </span>
          </div>
          {variant === 'full' && (
            <span
              className={`${textSizes[size].sub} uppercase font-medium mt-1 font-sans ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Scientific & Chemical Supplier · Pune
            </span>
          )}
        </div>
      )}
    </div>
  );
};
