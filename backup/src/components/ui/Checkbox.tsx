import React from 'react';

type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  className?: string;
  size?: ComponentSize;
}

const Checkbox = React.memo(function Checkbox({ 
  className = '', 
  size = 'md', 
  ...props 
}: CheckboxProps) {
  const sizeClasses: Record<ComponentSize, string> = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
  };
  
  const baseClasses = `${sizeClasses[size]} rounded border-gray-300 text-blue-600 focus:ring-blue-500`;
  return <input type="checkbox" className={`${baseClasses} ${className}`} {...props} />;
});

export { Checkbox };
export default Checkbox;
