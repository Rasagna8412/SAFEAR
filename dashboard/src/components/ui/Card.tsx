import { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'surface' | 'interactive' | 'highlight';
  noPadding?: boolean;
}

export function Card({
  children,
  variant = 'default',
  noPadding = false,
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-slate-900 border-slate-800 text-slate-100',
    surface: 'bg-slate-950 border-slate-800/80 text-slate-100',
    interactive:
      'bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 cursor-pointer active:scale-[0.99]',
    highlight:
      'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/40 text-slate-100 shadow-xl shadow-amber-500/5'
  };

  const paddingStyle = noPadding ? '' : 'p-5 sm:p-6';

  return (
    <div
      className={`border rounded-xl shadow-md ${variantStyles[variant]} ${paddingStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
