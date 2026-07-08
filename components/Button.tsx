import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-md focus-ring touch-target transition-colors duration-150 cursor-pointer';

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary/90 text-white',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white',
    cta: 'bg-cta hover:bg-cta/90 text-white',
    outline: 'border border-border text-foreground hover:bg-border',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? (
        <span className="inline-flex items-center">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}