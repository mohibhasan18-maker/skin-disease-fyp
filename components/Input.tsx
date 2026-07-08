import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-foreground/80 ml-1">
          {label}
          {props.required && <span className="text-accent ml-1" aria-label="required">*</span>}
        </label>
      )}
      <div className="relative group">
        <input
          id={inputId}
          {...props}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full px-4 py-3 bg-surface-highest border border-foreground/10 rounded-xl focus:outline-none focus:border-secondary transition-all duration-300 placeholder:text-foreground/30 focus:shadow-[0_0_15px_rgba(137,206,255,0.2)] ${
            error ? 'border-red-500/50 bg-red-500/5' : ''
          } ${className}`}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-400 font-medium ml-1 flex items-center gap-1" role="alert">
          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-foreground/50 ml-1">
          {helperText}
        </p>
      )}
    </div>
  );
}