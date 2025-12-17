import React from 'react';
import Card from '@/shared/components/ui/Card';
const SocialMediaGallery = ({ items = [] as unknown[] }) => (
  <Card />
    <Card.Header />
      <Card.Title>Galeria</Card.Title>
    </Card.Header>
    <Card.Content />
      <div className="{(items || []).map((it: unknown) => (">$2</div>
      <div key={it.id} className="aspect-square bg-gray-100 rounded">
    </>
  ))}
        </div>
        {items.length === 0 && <p className="text-gray-500">Sem itens</p>}
      </div>
    </Card.Content>
  </Card>);

export default SocialMediaGallery;
