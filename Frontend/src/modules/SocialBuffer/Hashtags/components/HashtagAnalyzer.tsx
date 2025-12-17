import React from 'react';
import Card from '@/shared/components/ui/Card';
const HashtagAnalyzer = ({ term = '' }) => (
  <Card />
    <Card.Header />
      <Card.Title>Analisador</Card.Title>
    </Card.Header>
    <Card.Content />
      <div className="text-sm">Termo: {term || '—'}</div>
    </Card.Content>
  </Card>);

export default HashtagAnalyzer;
