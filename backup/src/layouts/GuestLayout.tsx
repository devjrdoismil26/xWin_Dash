import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/components/ui/ApplicationLogo';
import { cn } from '@/lib/utils';

interface GuestLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg';
  className?: string;
}

const maxWidthClasses = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md', 
  lg: 'sm:max-w-lg',
};

const GuestLayout: React.FC<GuestLayoutProps> = ({ 
  children, 
  title,
  subtitle,
  maxWidth = 'md',
  className = ''
}) => {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/" className="block">
          <ApplicationLogo className="w-20 h-20 fill-current text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors" />
        </Link>
      </div>

      {/* Main Card */}
      <div className={cn(
        "w-full mt-6 px-6 py-8 bg-white dark:bg-gray-800 shadow-xl overflow-hidden sm:rounded-2xl border border-gray-200 dark:border-gray-700",
        maxWidthClasses[maxWidth],
        className
      )}>
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 xWin Dash. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default GuestLayout;
