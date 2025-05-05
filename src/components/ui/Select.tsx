import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      label,
      helperText,
      error,
      fullWidth = false,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    
    const sizeClasses = {
      sm: 'py-1.5 text-xs',
      md: 'py-2 text-sm',
      lg: 'py-3 text-base',
    };
    
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
          <select
            ref={ref}
            className={cn(
              'block w-full px-4 pr-10 bg-white border rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none',
              sizeClasses[size],
              hasError
                ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
                : 'border-gray-300',
              fullWidth ? 'w-full' : '',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              props.id ? `${props.id}-error ${props.id}-description` : undefined
            }
            {...props}
          >
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
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

Select.displayName = 'Select';

export default Select;