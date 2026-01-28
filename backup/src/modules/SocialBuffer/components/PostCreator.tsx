import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const PostCreator = ({ onCreate }) => {
  const [text, setText] = useState('');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Novo Post</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          <Textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
          <div className="text-right">
            <Button onClick={() => onCreate?.(text)}>Criar</Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default PostCreator;
