
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  theme?: 'dark' | 'light';
}

export const Logo = ({ className = "", size = 32, showText = true, theme = 'dark' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className} select-none overflow-visible`}>
      <div 
        className="relative flex items-center justify-center bg-indigo-600 shrink-0"
        style={{ 
          width: size, 
          height: size, 
          borderRadius: size * 0.3,
          boxShadow: '0 4px 16px -4px rgba(99, 102, 241, 0.5)'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white"
          style={{ width: size * 0.55, height: size * 0.55 }}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center overflow-visible">
          <div className="flex items-baseline leading-none overflow-visible">
            <span className={`font-black text-lg lg:text-xl tracking-tighter italic flex items-baseline whitespace-nowrap overflow-visible ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Agent<span className="pulse-gradient ml-0.5 inline-flex overflow-visible pr-5 py-1">Pulse</span>
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[7px] text-indigo-500/80 font-black uppercase tracking-[0.2em] antialiased leading-none">
              V51.2.3 ALPHA
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
