import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  noPadding?: boolean;
}

export function Card({
  children,
  className,
  title,
  description,
  footer,
  actions,
  noPadding = false
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex justify-between items-start px-6 py-4 border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className={cn(noPadding ? '' : 'p-6')}>{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;