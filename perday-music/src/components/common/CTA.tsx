import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { shouldAnimateButton, ANIM } from '../../lib/shouldAnimate';

// CTA variants using class-variance-authority
const ctaVariants = cva(
  // Base styles
  [
    'relative inline-flex items-center justify-center font-semibold transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  ],
  {
    variants: {
      variant: {
        // Primary gradient buttons
        primary: [
          'bg-gradient-to-r from-magenta-500 via-cyan-400 to-purple-600',
          'hover:from-magenta-600 hover:via-cyan-500 hover:to-purple-700',
          'text-synth-white shadow-lg hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)]',
          'transform hover:scale-[1.02]'
        ],
        
        // Secondary outline buttons
        secondary: [
          'border-2 border-cyan-400/40 text-cyan-300',
          'hover:bg-cyan-400/20 hover:border-cyan-400/60',
          'backdrop-blur-sm bg-black/20'
        ],
        
        // Liquid glass effect
        liquid: [
          'bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-magenta-500/20',
          'backdrop-blur-xl border border-cyan-400/30',
          'hover:from-cyan-500/30 hover:via-purple-500/30 hover:to-magenta-500/30',
          'shadow-[0_8px_32px_rgba(0,188,212,0.3)] hover:shadow-[0_8px_32px_rgba(0,188,212,0.5)]'
        ],
        
        // Danger/error buttons
        danger: [
          'bg-gradient-to-r from-red-500 to-red-600',
          'hover:from-red-600 hover:to-red-700',
          'text-white shadow-lg hover:shadow-[0_8px_20px_rgba(239,68,68,0.4)]'
        ],
        
        // Success buttons
        success: [
          'bg-gradient-to-r from-green-500 to-green-600',
          'hover:from-green-600 hover:to-green-700',
          'text-white shadow-lg hover:shadow-[0_8px_20px_rgba(34,197,94,0.4)]'
        ]
      },
      
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-lg',
        lg: 'h-12 px-6 text-lg rounded-xl',
        xl: 'h-14 px-8 text-xl rounded-2xl'
      },
      
      animation: {
        none: '',
        pulse: 'animate-pulse',
        breathe: 'animate-breathe',
        glow: 'animate-amberGlow'
      }
    },
    
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      animation: 'none'
    }
  }
);

// Props interface
export interface CTAProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ctaVariants> {
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

// Main CTA component
export const CTA = React.forwardRef<HTMLButtonElement, CTAProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Animation logic
    const isAnimating = shouldAnimateButton();
    const animationDuration = isAnimating ? ANIM.duration.md : 0.1;
    
    return (
      <button
        className={cn(
          ctaVariants({ variant, size, animation }),
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        style={{
          transitionDuration: `${animationDuration}s`,
          transitionTimingFunction: isAnimating ? ANIM.ease.inOut : 'linear'
        }}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'flex items-center gap-2',
          loading && 'opacity-0'
        )}>
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          
          {/* Text content */}
          <span>{children}</span>
          
          {/* Right icon */}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>
      </button>
    );
  }
);

CTA.displayName = 'CTA';

// Export variants for external use
// eslint-disable-next-line react-refresh/only-export-components
export { ctaVariants };
