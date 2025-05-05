import React from 'react';
import { cn } from '../../lib/utils';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
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
        <textarea
          ref={ref}
          className={cn(
            'block w-full px-4 py-2 bg-white border rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
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
        />
        
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

TextArea.displayName = 'TextArea';

export default TextArea;