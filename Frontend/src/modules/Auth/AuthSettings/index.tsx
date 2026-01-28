import React from 'react';
import SecuritySettings from './pages/SecuritySettings.tsx';
import PermissionManager from './pages/PermissionManager.tsx';
import RoleManager from './pages/RoleManager.tsx';
import ActiveSessions from './pages/ActiveSessions.tsx';
export default function AuthModule() {
  return (
    <Routes>
      <Route index element={<SecuritySettings />} />
      <Route path="/permissions" element={<PermissionManager />} />
      <Route path="/roles" element={<RoleManager />} />
      <Route path="/sessions" element={<ActiveSessions />} />
    </Routes>
  );
}
