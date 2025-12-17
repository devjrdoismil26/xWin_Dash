import React from 'react';
import Card from '@/shared/components/ui/Card';
export default function UserDetails() {
  const user = { id: 1, name: 'Admin', email: 'admin@example.com'};

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>{user.name}</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div>Email: {user.email}</div>
            <div>ID: {user.id}</div>
        </Card.Content></Card></div>);

}
