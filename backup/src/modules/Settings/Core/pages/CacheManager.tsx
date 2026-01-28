import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
export default function CacheManager() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cache</h1>
      <Card>
        <Card.Content>
          <div className="flex items-center justify-between">
            <p>Cache management interface</p>
            <Button variant="outline">Limpar Cache</Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
