import React from 'react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-6">
      {children}
    </div>
  </div>
);

export default DashboardLayout;
