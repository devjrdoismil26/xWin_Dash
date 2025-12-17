import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
import { SocialPost } from '../types/post';

const SocialPostCreateEdit: React.FC<{ post?: SocialPost }> = ({ post    }) => {
  const [text, setText] = useState(post?.text || '');

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>{post ? 'Editar Post' : 'Novo Post'}</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="text">Texto</InputLabel>
              <Textarea id="text" rows={4} value={text} onChange={ (e: unknown) => setText(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="schedule">Agendar (opcional)</InputLabel>
              <Input id="schedule" type="datetime-local" / /></div></Card.Content>
        <Card.Footer />
          <Button>Salvar</Button>
        </Card.Footer></Card></div>);};

export default SocialPostCreateEdit;
