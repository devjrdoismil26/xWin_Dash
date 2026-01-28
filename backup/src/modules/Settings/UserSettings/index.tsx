import React from 'react';
import UsersList from './pages/UsersList.tsx';
import UserCreate from './pages/UserCreate.tsx';
import UserEdit from './pages/UserEdit.tsx';
import UserDetails from './pages/UserDetails.tsx';
import UserPermissions from './pages/UserPermissions.tsx';
import UserRoles from './pages/UserRoles.tsx';
export default function UsersSettingsModule() {
  return (
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="/create" element={<UserCreate />} />
      <Route path=":id" element={<UserDetails />} />
      <Route path=":id/edit" element={<UserEdit />} />
      <Route path=":id/permissions" element={<UserPermissions />} />
      <Route path=":id/roles" element={<UserRoles />} />
    </Routes>
  );
}
