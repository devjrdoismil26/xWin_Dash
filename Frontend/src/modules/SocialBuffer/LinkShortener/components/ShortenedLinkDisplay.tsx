import React from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
interface ShortenedLinkDisplayProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ShortenedLinkDisplay = ({ shortUrl, onCopy }) => (
  <Card />
    <Card.Content />
      <div className=" ">$2</div><div className="font-mono text-sm">{shortUrl || '-'}</div>
        <Button size="sm" variant="outline" onClick={ () => onCopy?.(shortUrl) }>Copiar</Button></div></Card.Content>
  </Card>);

export default ShortenedLinkDisplay;
