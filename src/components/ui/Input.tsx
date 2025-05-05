import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    
    return (
      <div className={cn('mb-4', fullWidth ? 'w-full' : '')}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'block px-4 py-2 bg-white border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
              hasError
                ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                : 'border-gray-300',
              icon && iconPosition === 'left' ? 'pl-10' : '',
              icon && iconPosition === 'right' ? 'pr-10' : '',
              fullWidth ? 'w-full' : '',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              props.id ? `${props.id}-error ${props.id}-description` : undefined
            }
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <div className="mt-1">
            {error && (
              <p 
                className="text-error-600 text-sm" 
                id={props.id ? `${props.id}-error` : undefined}
              >
                {error}
              </p>
            )}
            {helperText && !error && (
              <p 
                className="text-gray-500 text-sm" 
                id={props.id ? `${props.id}-description` : undefined}
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;