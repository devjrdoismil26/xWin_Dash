import React from 'react';
import UsersList from './pages/UsersList';
import UserCreate from './pages/UserCreate';
import UserEdit from './pages/UserEdit';
import UserDetails from './pages/UserDetails';
import UserPermissions from './pages/UserPermissions';
import UserRoles from './pages/UserRoles';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
export default function UsersSettingsModule() { return (
        <>
      <Routes />
      <Route index element={<UsersList /> } />
      <Route path="/create" element={ <UserCreate /> } />
      <Route path=":id" element={ <UserDetails /> } />
      <Route path=":id/edit" element={ <UserEdit /> } />
      <Route path=":id/permissions" element={ <UserPermissions /> } />
      <Route path=":id/roles" element={ <UserRoles /> } />
    </Routes>);

}
