import React from 'react';
import Card from '@/shared/components/ui/Card';
import { SocialPost } from '../types/post';

const SocialPostShow: React.FC<{ post?: SocialPost }> = ({ post    }) => (
  <div className=" ">$2</div><Card />
      <Card.Header />
        <Card.Title>Post</Card.Title>
      </Card.Header>
      <Card.Content />
        <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(post || { id: 1, text: 'Olá mundo' }, null, 2)}</pre>
      </Card.Content></Card></div>);

export default SocialPostShow;
