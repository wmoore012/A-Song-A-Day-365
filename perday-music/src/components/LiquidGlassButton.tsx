import { useRef, useState, useCallback } from 'react';
// gsap import removed as it's not used

interface LiquidGlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rippleEffect?: boolean;
}

export default function LiquidGlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  style,
  icon,
  iconPosition = 'left',
  rippleEffect = true,
}: LiquidGlassButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleCounter = useRef(0);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-synth-white bg-gradient-to-r from-synth-violet/30 to-synth-magenta/30 border-synth-violet/50 hover:from-synth-violet/40 hover:to-synth-magenta/40 hover:border-synth-violet/60';
      case 'secondary':
        return 'text-synth-icy bg-synth-violet/20 border-synth-violet/40 hover:bg-synth-violet/30 hover:border-synth-violet/50';
      case 'ghost':
        return 'text-synth-white bg-transparent border-synth-icy/20 hover:bg-synth-icy/10 hover:border-synth-icy/40';
      case 'danger':
        return 'text-synth-white bg-gradient-to-r from-red-500/30 to-pink-600/30 border-red-400/50 hover:from-red-400/40 hover:to-pink-500/40 hover:border-red-400/60';
      default:
        return 'text-synth-white bg-synth-violet/20 border-synth-violet/40 hover:bg-synth-violet/30';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl';
      case 'xl':
        return 'px-10 py-5 text-xl rounded-3xl';
      default:
        return 'px-6 py-3 text-base rounded-2xl';
    }
  };

  const createRipple = useCallback((e: React.MouseEvent) => {
    if (!rippleEffect || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleCounter.current++,
      x,
      y,
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, [rippleEffect]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled || loading) return;

    createRipple(e);
    setIsPressed(false);
    onClick?.();
  }, [disabled, loading, onClick, createRipple]);

  const buttonContent = (
    <div className="flex items-center justify-center gap-2">
      {loading && (
        <div className="w-4 h-4 border-2 border-synth-icy/30 border-t-synth-icy rounded-full animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </div>
  );

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        liquid-glass-button
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : ''}
        transition-all duration-150 ease-out
        font-medium
        select-none
        backdrop-blur-3xl
        relative
        overflow-hidden
        ${className}
      `}
      style={style}
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            transform: 'translate(-50%, -50%)',
            animation: 'liquidRipple 0.6s ease-out forwards',
          }}
        />
      ))}

      {buttonContent}

      <style>{`
        .liquid-glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(0, 0, 0, 0.2), 
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2), 
            0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          transform-origin: center center;
        }

        .liquid-glass-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          pointer-events: none;
          z-index: 1;
        }

        .liquid-glass-button:hover {
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 
            0 16px 50px rgba(0, 0, 0, 0.4),
            inset 0 2px 4px rgba(0, 0, 0, 0.2), 
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2), 
            0 0 25px rgba(255, 255, 255, 0.15);
        }

        .liquid-glass-button:active {
          transform: translateY(1px) scale(0.96);
          border-color: rgba(255, 255, 255, 0.5);
          transition: all 0.1s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @keyframes liquidRipple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
