import React from 'react';
import Card from '@/components/ui/Card';
export default function UserDetails() {
  const user = { id: 1, name: 'Admin', email: 'admin@example.com' };
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>{user.name}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-1 text-sm">
            <div>Email: {user.email}</div>
            <div>ID: {user.id}</div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
