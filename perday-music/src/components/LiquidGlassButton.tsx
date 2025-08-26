import { useRef, useState, useCallback } from 'react';
import styles from './LiquidGlassButton.module.css';
// gsap import removed as it's not used
import styles from "./LiquidGlassButton.module.css";
import { cn } from "../lib/utils";

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
        ${styles.liquidGlassButton}
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : ''}
        transition-all duration-150 ease-out
        font-medium
        select-none
        overflow-hidden
        ${className}
      `}
      style={style}
    >
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={cn("absolute pointer-events-none", styles.ripple)}

          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {buttonContent}
    </button>
  );
}
