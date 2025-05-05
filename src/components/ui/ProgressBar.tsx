import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  className,
}: ProgressBarProps) => {
  const percentage = Math.round((value / max) * 100);
  
  const variantClasses = {
    default: 'bg-gray-500',
    primary: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const getColorByPercentage = () => {
    if (percentage < 25) return 'bg-error-500';
    if (percentage < 50) return 'bg-warning-500';
    if (percentage < 75) return 'bg-primary-500';
    return 'bg-success-500';
  };

  const barColor = variant === 'default' ? getColorByPercentage() : variantClasses[variant];
  
  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <div className="text-sm font-medium text-gray-700">{label}</div>}
          {showValue && (
            <div className="text-sm font-medium text-gray-500">{percentage}%</div>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('transition-all duration-300 ease-in-out rounded-full', barColor)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;