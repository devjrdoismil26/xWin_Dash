import React from 'react';
import ActivityDashboard from './pages/ActivityDashboard.tsx';
import ActivityDetails from './pages/ActivityDetails.tsx';
import ActivityList from './pages/ActivityList.tsx';
export default function ActivityModule() {
  // This module is designed to work with Inertia.js routing
  // Individual pages should be accessed via Inertia routes
  return null;
}
// Export individual components for use in Inertia pages
export {
  ActivityDashboard,
  ActivityDetails,
  ActivityList
};
