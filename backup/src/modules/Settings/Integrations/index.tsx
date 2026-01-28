import React from 'react';
import IntegrationManager from './pages/IntegrationManager.tsx';
export default function IntegrationsModule() {
  return (
    <Routes>
      <Route index element={<IntegrationManager />} />
    </Routes>
  );
}
