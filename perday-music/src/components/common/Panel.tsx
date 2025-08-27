import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { shouldAnimateModal, ANIM } from '../../lib/motion';

// Panel variants using class-variance-authority
const panelVariants = cva(
  // Base styles
  [
    'relative transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2'
  ],
  {
    variants: {
      variant: {
        // Default panel
        default: [
          'bg-white dark:bg-gray-800',
          'border border-gray-200 dark:border-gray-700',
          'rounded-lg shadow-sm'
        ],
        
        // Glass morphism
        glass: [
          'bg-white/10 dark:bg-black/20',
          'backdrop-blur-xl border border-white/20 dark:border-white/10',
          'rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
        ],
        
        // Gradient background
        gradient: [
          'bg-gradient-to-br from-magenta-900/20 via-cyan-900/20 to-purple-900/20',
          'backdrop-blur-xl ring-1 ring-cyan-400/30',
          'rounded-2xl shadow-2xl'
        ],
        
        // Neon glow
        neon: [
          'bg-black/80 backdrop-blur-sm',
          'border border-cyan-400/40',
          'rounded-xl shadow-[0_0_20px_rgba(0,188,212,0.3)]',
          'hover:shadow-[0_0_30px_rgba(0,188,212,0.5)]'
        ],
        
        // Premium dark
        premium: [
          'bg-gradient-to-br from-gray-900 via-gray-800 to-black',
          'border border-gray-700/50',
          'rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]'
        ],
        
        // Hero section
        hero: [
          'bg-gradient-to-br from-black via-gray-900 to-black',
          'min-h-screen flex items-center justify-center',
          'relative isolate'
        ],
        
        // Overlay
        overlay: [
          'fixed inset-0 bg-black/90 backdrop-blur-xl',
          'flex items-center justify-center z-50'
        ],
        
        // Sidebar
        sidebar: [
          'bg-gradient-to-b from-gray-900 to-black',
          'border-r border-gray-700/50',
          'h-full shadow-xl'
        ]
      },
      
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
        full: 'p-0'
      },
      
      layout: {
        stack: 'flex flex-col space-y-4',
        row: 'flex flex-row space-x-4',
        center: 'flex items-center justify-center',
        grid: 'grid gap-4',
        none: ''
      },
      
      animation: {
        none: '',
        fadeIn: 'animate-fadeIn',
        slideUp: 'animate-slideUp',
        slideIn: 'animate-slideInRight',
        scaleIn: 'animate-scaleIn'
      }
    },
    
    defaultVariants: {
      variant: 'default',
      size: 'md',
      layout: 'none',
      animation: 'none'
    }
  }
);

// Props interface
export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  loading?: boolean;
  interactive?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
}

// Main Panel component
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      variant,
      size,
      layout,
      animation,
      as: Component = 'div',
      loading = false,
      interactive = false,
      fullWidth = false,
      fullHeight = false,
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
          panelVariants({ variant, size, layout, animation }),
          fullWidth && 'w-full',
          fullHeight && 'h-full',
          interactive && 'cursor-pointer',
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
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'relative',
          loading && 'opacity-50'
        )}>
          {children}
        </div>
      </Component>
    );
  }
);

Panel.displayName = 'Panel';

// Panel sub-components
export const PanelHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between p-6 pb-4', className)}
    {...props}
  />
));
PanelHeader.displayName = 'PanelHeader';

export const PanelTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-xl font-semibold', className)}
    {...props}
  />
));
PanelTitle.displayName = 'PanelTitle';

export const PanelContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
PanelContent.displayName = 'PanelContent';

export const PanelFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-end gap-2 p-6 pt-0', className)}
    {...props}
  />
));
PanelFooter.displayName = 'PanelFooter';

// Export variants for external use
// eslint-disable-next-line react-refresh/only-export-components
export { panelVariants };
