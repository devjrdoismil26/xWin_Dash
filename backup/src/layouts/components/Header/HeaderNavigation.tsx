import React from 'react';
import DynamicNavigation from '@/components/Navigation/DynamicNavigation';
import PortalNavigation from '@/components/navigation/PortalNavigation';

interface HeaderNavigationProps {
  isPortalPage: boolean;
  className?: string;
}

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  isPortalPage,
  className = ''
}) => {
  return (
    <div className={`hidden lg:ml-8 lg:flex lg:space-x-1 ${className}`}>
      {isPortalPage ? (
        <PortalNavigation className="flex space-x-1" />
      ) : (
        <DynamicNavigation />
      )}
    </div>
  );
};

export default HeaderNavigation;