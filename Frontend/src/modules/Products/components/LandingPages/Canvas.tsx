import React from 'react';
import Card from '@/shared/components/ui/Card';
interface CanvasProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const Canvas = ({ content }) => {
  return (
        <>
      <Card />
      <Card.Content />
        <div className="Canvas placeholder">$2</div>
        </div>
      </Card.Content>
    </Card>);};

export default Canvas;
