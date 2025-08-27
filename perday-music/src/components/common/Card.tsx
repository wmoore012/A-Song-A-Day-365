import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { shouldAnimateModal, ANIM } from '../../lib/shouldAnimate';

// Card variants using class-variance-authority
const cardVariants = cva(
  // Base styles
  [
    'relative overflow-hidden transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2'
  ],
  {
    variants: {
      variant: {
        // Default card
        default: [
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'shadow-sm hover:shadow-md'
        ],
        
        // Glass morphism
        glass: [
          'bg-white/10 dark:bg-black/20',
          'backdrop-blur-xl border border-white/20 dark:border-white/10',
          'shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
        ],
        
        // Gradient background
        gradient: [
          'bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20',
          'backdrop-blur-xl ring-1 ring-cyan-400/30',
          'shadow-2xl'
        ],
        
        // Neon glow
        neon: [
          'bg-black/80 backdrop-blur-sm',
          'border border-cyan-400/40',
          'shadow-[0_0_20px_rgba(0,188,212,0.3)]',
          'hover:shadow-[0_0_30px_rgba(0,188,212,0.5)]'
        ],
        
        // Premium dark
        premium: [
          'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
          'border border-gray-700/50',
          'shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
        ]
      },
      
      size: {
        sm: 'p-4 rounded-lg',
        md: 'p-6 rounded-xl',
        lg: 'p-8 rounded-2xl',
        xl: 'p-10 rounded-3xl'
      },
      
      elevation: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl'
      },
      
      animation: {
        none: '',
        fadeIn: 'animate-fadeIn',
        slideUp: 'animate-slideUp',
        scaleIn: 'animate-scaleIn'
      }
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      elevation: 'md',
      animation: 'none'
    }
  }
);

// Props interface
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  interactive?: boolean;
  loading?: boolean;
  hoverEffect?: boolean;
}

// Main Card component
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      elevation,
      animation,
      as: Component = 'div',
      interactive = false,
      loading = false,
      hoverEffect = false,
      children,
      ...props
    },
    ref
  ) => {
    // Animation logic
    const isAnimating = shouldAnimateModal();
    const animationDuration = isAnimating ? ANIM.duration.md : 0.1;
    
    return (
      <Component
        ref={ref}
        className={cn(
          cardVariants({ variant, size, elevation, animation }),
          interactive && 'cursor-pointer',
          hoverEffect && 'hover:scale-[1.02] hover:shadow-xl',
          loading && 'animate-pulse',
          className
        )}
        style={{
          transitionDuration: `${animationDuration}s`,
          transitionTimingFunction: isAnimating ? ANIM.ease.inOut : 'linear'
        }}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'relative z-10',
          loading && 'opacity-50'
        )}>
          {children}
        </div>
      </Component>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Export variants for external use
export { cardVariants };
