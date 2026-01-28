import React from 'react';
import Card from '@/components/ui/Card';
const SocialMediaGallery = ({ items = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Galeria</Card.Title>
    </Card.Header>
    <Card.Content>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.id} className="aspect-square bg-gray-100 rounded" />
        ))}
        {items.length === 0 && <p className="text-gray-500">Sem itens</p>}
      </div>
    </Card.Content>
  </Card>
);
export default SocialMediaGallery;
