import React from 'react';
import Card from '@/shared/components/ui/Card';
const TrendingHashtagsDisplay = ({ items = [] as unknown[] }) => (
  <Card />
    <Card.Header />
      <Card.Title>Em Alta</Card.Title>
    </Card.Header>
    <Card.Content />
      <div className="{(items || []).map((t: unknown) => (">$2</div>
          <span key={t} className="px-2 py-1 bg-gray-100 rounded">#{t}</span>
        ))}
        {items.length === 0 && <span className="text-gray-500">Sem dados</span>}
      </div>
    </Card.Content>
  </Card>);

export default TrendingHashtagsDisplay;
