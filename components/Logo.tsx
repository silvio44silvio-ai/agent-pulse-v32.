
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  theme?: 'dark' | 'light';
}

export const Logo = ({ className = "", size = 48, showText = true, theme = 'dark' }: LogoProps) => {
  return (
    <div className={`flex items-center gap-3 lg:gap-4 ${className}`}>
      <div 
        className="relative flex items-center justify-center overflow-hidden bg-indigo-600 shrink-0"
        style={{ 
          width: size, 
          height: size, 
          borderRadius: size * 0.35,
          boxShadow: '0 8px 24px -6px rgba(99, 102, 241, 0.6)'
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white"
          style={{ width: size * 0.55, height: size * 0.55 }}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-black text-xl lg:text-2xl tracking-tighter leading-none italic ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Agent<span className="pulse-gradient">Pulse</span>
          </span>
          <div className="flex flex-col mt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em] antialiased leading-none">
                PROTOCOL V32
              </span>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.1em] mt-1.5 antialiased leading-none border-l-2 border-indigo-500/30 pl-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              IMOBILIÁRIAS & CORRETORES
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
