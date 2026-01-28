import React from 'react';

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
  children?: React.ReactNode;
  required?: boolean;
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ value, className = '', children, required = false, ...props }, ref) => (
    <label 
      ref={ref}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} 
      {...props}
    >
      {value || children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
);

InputLabel.displayName = 'InputLabel';

export default InputLabel;
