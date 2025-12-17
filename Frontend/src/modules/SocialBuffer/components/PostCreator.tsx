import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
const PostCreator = ({ onCreate }) => {
  const [text, setText] = useState('');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Novo Post</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className=" ">$2</div><Textarea rows={4} value={text} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value) } />
          <div className=" ">$2</div><Button onClick={ () => onCreate?.(text) }>Criar</Button></div></Card.Content>
    </Card>);};

export default PostCreator;
