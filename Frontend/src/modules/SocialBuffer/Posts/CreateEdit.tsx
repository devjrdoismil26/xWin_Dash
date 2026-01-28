import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const SocialPostCreateEdit: React.FC<{ post?: any }> = ({ post }) => {
  const [text, setText] = useState(post?.text || '');
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title>{post ? 'Editar Post' : 'Novo Post'}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            <div>
              <InputLabel htmlFor="text">Texto</InputLabel>
              <Textarea id="text" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="schedule">Agendar (opcional)</InputLabel>
              <Input id="schedule" type="datetime-local" />
            </div>
          </div>
        </Card.Content>
        <Card.Footer>
          <Button>Salvar</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default SocialPostCreateEdit;
