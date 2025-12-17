import React from 'react';
import SecuritySettings from './pages/SecuritySettings';
import PermissionManager from './pages/PermissionManager';
import RoleManager from './pages/RoleManager';
import ActiveSessions from './pages/ActiveSessions';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
export default function AuthModule() { return (
        <>
      <Routes />
      <Route index element={<SecuritySettings /> } />
      <Route path="/permissions" element={ <PermissionManager /> } />
      <Route path="/roles" element={ <RoleManager /> } />
      <Route path="/sessions" element={ <ActiveSessions /> } />
    </Routes>);

}
