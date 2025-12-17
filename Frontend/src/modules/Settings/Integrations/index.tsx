import React from 'react';
import IntegrationManager from './pages/IntegrationManager';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
export default function IntegrationsModule() { return (
        <>
      <Routes />
      <Route index element={<IntegrationManager /> } />
    </Routes>);

}
