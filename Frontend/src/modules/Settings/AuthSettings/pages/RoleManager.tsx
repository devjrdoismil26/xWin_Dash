import React from 'react';
import Card from '@/shared/components/ui/Card';
export default function RoleManager() {
  const roles = [
    { id: 1, name: 'Admin', description: 'Full access' },
    { id: 2, name: 'Editor', description: 'Content management' },
  ];
  return (
            <div className=" ">$2</div><h1 className="text-2xl font-semibold">Funções</h1>
      <Card />
        <Card.Content />
          <ul className="divide-y" />
            {(roles || []).map((role: unknown) => (
              <li key={role.id} className="py-3" />
                <div className="font-medium">{role.name}</div>
                <div className="text-xs text-gray-500">{role.description}</div>
      </li>
    </>
  ))}
          </ul>
        </Card.Content></Card></div>);

}
