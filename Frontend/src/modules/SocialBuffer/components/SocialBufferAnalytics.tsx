import React from 'react';
import Card from '@/shared/components/ui/Card';
const SocialBufferAnalytics = ({ data = {} as any }) => (
  <Card />
    <Card.Header />
      <Card.Title>Analytics</Card.Title>
    </Card.Header>
    <Card.Content />
      <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
    </Card.Content>
  </Card>);

export default SocialBufferAnalytics;
