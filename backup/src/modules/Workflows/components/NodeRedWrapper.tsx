import React from 'react';
import Card from '@/components/ui/Card';
const NodeRedWrapper = ({ children }) => (
  <Card>
    <Card.Content>{children || <div className="h-64 bg-gray-100 rounded" />}</Card.Content>
  </Card>
);
export default NodeRedWrapper;
