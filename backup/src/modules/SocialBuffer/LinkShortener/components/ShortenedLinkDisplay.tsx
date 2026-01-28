import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
const ShortenedLinkDisplay = ({ shortUrl, onCopy }) => (
  <Card>
    <Card.Content>
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm">{shortUrl || '-'}</div>
        <Button size="sm" variant="outline" onClick={() => onCopy?.(shortUrl)}>Copiar</Button>
      </div>
    </Card.Content>
  </Card>
);
export default ShortenedLinkDisplay;
