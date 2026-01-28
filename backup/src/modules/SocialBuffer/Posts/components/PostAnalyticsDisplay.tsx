import React from 'react';
import Card from '@/components/ui/Card';
interface PostAnalyticsDisplayProps {
  analytics?: Record<string, any>;
}
const PostAnalyticsDisplay: React.FC<PostAnalyticsDisplayProps> = ({ 
  analytics = {} 
}) => (
  <Card>
    <Card.Header>
      <Card.Title>Métricas</Card.Title>
    </Card.Header>
    <Card.Content>
      <pre className="text-xs bg-gray-50 p-2 rounded">
        {JSON.stringify(analytics, null, 2)}
      </pre>
    </Card.Content>
  </Card>
);
export default PostAnalyticsDisplay;
