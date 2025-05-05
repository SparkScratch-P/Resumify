import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const Tabs = ({
  children,
  className,
  variant = 'default',
}: TabsProps) => {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
};

interface TabListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const TabList = ({
  children,
  className,
  variant = 'default',
}: TabListProps) => {
  const variantClasses = {
    default: 'border-b border-gray-200',
    pills: 'flex space-x-1 p-1 bg-gray-100 rounded-lg',
    underline: 'border-b border-gray-200',
  };

  return (
    <div
      className={cn(
        'flex',
        variantClasses[variant],
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
};

interface TabTriggerProps {
  children: React.ReactNode;
  value: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  disabled?: boolean;
}

const TabTrigger = ({
  children,
  value,
  isActive = false,
  onClick,
  className,
  variant = 'default',
  disabled = false,
}: TabTriggerProps) => {
  const baseClasses = 'flex items-center justify-center px-4 py-2 text-sm font-medium transition-all focus:outline-none';
  
  const variantClasses = {
    default: `${
      isActive
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
    }`,
    pills: `${
      isActive
        ? 'bg-white text-primary-600 shadow'
        : 'text-gray-500 hover:text-gray-900'
    } rounded-md`,
    underline: `${
      isActive
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
    }`,
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      className={cn(
        baseClasses,
        variantClasses[variant],
        disabledClasses,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </button>
  );
};

interface TabContentProps {
  children: React.ReactNode;
  value: string;
  isActive?: boolean;
  className?: string;
}

const TabContent = ({
  children,
  value,
  isActive = false,
  className,
}: TabContentProps) => {
  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn(
        'mt-4 focus:outline-none animate-fade-in',
        className
      )}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

export { Tabs, TabList, TabTrigger, TabContent };