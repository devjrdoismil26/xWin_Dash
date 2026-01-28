import React from 'react';
import Card from '@/components/ui/Card';
interface PostPreviewProps {
  text?: string;
}
const PostPreview: React.FC<PostPreviewProps> = ({ 
  text = '' 
}) => (
  <Card>
    <Card.Header>
      <Card.Title>Prévia</Card.Title>
    </Card.Header>
    <Card.Content>
      <div className="whitespace-pre-wrap text-sm">
        {text || 'Sem conteúdo'}
      </div>
    </Card.Content>
  </Card>
);
export default PostPreview;
