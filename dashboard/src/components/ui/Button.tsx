import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs min-h-[36px] gap-1.5',
      md: 'px-4 py-2.5 text-sm min-h-[44px] gap-2',
      lg: 'px-6 py-3.5 text-base min-h-[52px] gap-2.5'
    };

    const variantStyles = {
      primary:
        'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold focus:ring-amber-500 shadow-md shadow-amber-500/10 border border-amber-400/30',
      secondary:
        'bg-slate-800 hover:bg-slate-700 text-slate-100 focus:ring-slate-400 border border-slate-700',
      danger:
        'bg-red-600 hover:bg-red-500 text-white font-bold focus:ring-red-500 shadow-md shadow-red-600/20 border border-red-500/30',
      warning:
        'bg-amber-600 hover:bg-amber-500 text-white font-bold focus:ring-amber-600 border border-amber-500/30',
      outline:
        'bg-transparent hover:bg-slate-850 text-slate-200 border-2 border-slate-700 hover:border-slate-500 focus:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500 border border-transparent'
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
