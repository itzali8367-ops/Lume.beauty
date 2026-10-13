import React from 'react';
import { cn } from '../utils/cn';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function BrandLogo({ className, size = 'md', showSubtitle = false }: BrandLogoProps) {
  const iconSizes = {
    sm: 'h-8 w-8 rounded-xl',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-11 w-11 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      {/* Visual Logo Emblem */}
      <span
        className={cn(
          'relative flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/80 text-primary-foreground shadow-sm shadow-primary/20 transition-transform duration-300 hover:scale-105 overflow-hidden flex-shrink-0',
          iconSizes[size]
        )}
      >
        <span className="absolute inset-0 rounded-[inherit] border border-white/25 pointer-events-none" />
        <svg
          viewBox="0 0 32 32"
          className="h-full w-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 7C23 9.5 25.5 9.5 25.5 9.5C25.5 9.5 23 9.5 23 12C23 9.5 20.5 9.5 20.5 9.5C20.5 9.5 23 9.5 23 7Z"
            fill="#FFE7A0"
          />
          <text
            x="11"
            y="23"
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="18"
            fontWeight="700"
            fill="currentColor"
            textAnchor="middle"
          >
            L
          </text>
          <text
            x="20.5"
            y="20"
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="12"
            fontWeight="600"
            fill="currentColor"
            textAnchor="middle"
          >
            u
          </text>
          <line
            x1="19.5"
            y1="10.5"
            x2="22.5"
            y2="7.5"
            stroke="#FFE7A0"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display font-semibold tracking-tight text-foreground transition-colors hover:text-primary flex items-baseline gap-0.5',
            textSizes[size]
          )}
        >
          <span>Lumi</span>
          <span className="text-primary relative inline-block">
            •
            <span className="absolute -top-1 -right-0.5 h-1.5 w-1.5 rounded-full bg-accent/80 blur-[2px] animate-pulse" />
          </span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 mt-0.5">
            Beauty & Wellness
          </span>
        )}
      </div>
    </div>
  );
}
