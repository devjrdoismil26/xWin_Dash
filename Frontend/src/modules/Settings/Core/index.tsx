import React from 'react';
import SystemSettings from './pages/SystemSettings';
import EnvironmentConfig from './pages/EnvironmentConfig';
import CacheManager from './pages/CacheManager';
import MaintenanceMode from './pages/MaintenanceMode';
export default function CoreModule() {
  // This module is designed to work with Inertia.js routing
  // Individual pages should be accessed via Inertia routes
  return null;
}
// Export individual components for use in Inertia pages
export { SystemSettings, EnvironmentConfig, CacheManager, MaintenanceMode };
