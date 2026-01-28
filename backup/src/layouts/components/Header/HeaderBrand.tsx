import React from 'react';
import { Link } from '@inertiajs/react';

interface HeaderBrandProps {
  className?: string;
}

const HeaderBrand: React.FC<HeaderBrandProps> = ({ className = '' }) => {
  return (
    <div className={`shrink-0 flex items-center ${className}`}>
      <Link href="/" className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">xW</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">xWin Dash</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Business Platform</p>
        </div>
      </Link>
    </div>
  );
};

export default HeaderBrand;