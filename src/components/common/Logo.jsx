import React from 'react';
import { HeartPulse } from 'lucide-react';

export function LogoIcon({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-11 h-11 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-gradient-to-tr from-blue-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 flex-shrink-0 transition-transform group-hover:scale-105 ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <HeartPulse className={`${iconSizes[size] || iconSizes.md} text-white`} />
    </div>
  );
}

export function Logo({
  size = 'md',
  showText = true,
  whiteText = false,
  subtitle = null,
  className = ''
}) {
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <LogoIcon size={size} />
      {showText && (
        <div className="leading-none">
          <span
            className={`font-extrabold tracking-tight ${textSizes[size] || textSizes.md} ${
              whiteText ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}
          >
            Medi<span className={whiteText ? 'text-blue-200' : 'text-blue-600 dark:text-blue-400'}>Care</span>
          </span>
          {subtitle && (
            <span className="block text-[10px] font-bold text-slate-400 mt-1 tracking-wider uppercase">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;
