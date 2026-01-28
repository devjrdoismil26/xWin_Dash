import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
const SettingsHomePage: React.FC = () => {
  const categories = [
    { id: 'general', name: 'Gerais', route: '/settings/general' },
    { id: 'ai', name: 'IA', route: '/settings/ai' },
    { id: 'users', name: 'Usuários', route: '/settings/users' },
  ];
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.id}>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="font-medium">{c.name}</div>
                <Button size="sm" variant="outline">Abrir</Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default SettingsHomePage;
