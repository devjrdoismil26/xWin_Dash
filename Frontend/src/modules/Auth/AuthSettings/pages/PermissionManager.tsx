import React from 'react';
import Card from '@/components/ui/Card';
export default function PermissionManager() {
  const permissions = [
    { id: 1, name: 'Create Posts', module: 'Content', granted: true },
    { id: 2, name: 'Manage Users', module: 'Users', granted: false },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Permissões</h1>
      <Card>
        <Card.Content>
          <ul className="divide-y">
            {permissions.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.module}</div>
                </div>
                <input type="checkbox" checked={p.granted} readOnly />
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
}
