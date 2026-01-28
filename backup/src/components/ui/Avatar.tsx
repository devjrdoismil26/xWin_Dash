import React from 'react';
import { User } from 'lucide-react';
import { getSizeClasses, ComponentSize } from './design-tokens';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: ComponentSize;
  className?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className = '', 
  fallback 
}) => {
  const sizeClasses = getSizeClasses(size, 'icon');
  const baseClasses = `inline-flex items-center justify-center rounded-full bg-gray-100 ${sizeClasses} ${className}`;

  if (src) {
    return <img src={src} alt={alt} className={`${baseClasses} object-cover`} />;
  }

  return (
    <div className={baseClasses}>
      {fallback ? (
        <span className="text-sm font-medium text-gray-600">{fallback}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-gray-400" />
      )}
    </div>
  );
};

export default Avatar;
