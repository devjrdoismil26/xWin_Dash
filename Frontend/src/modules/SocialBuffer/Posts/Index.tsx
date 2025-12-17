import React, { useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import useSocialBuffer from '../hooks/useSocialBuffer';

const SocialPostsIndex: React.FC = () => {
  const { posts, loading, fetchPosts } = useSocialBuffer();

  useEffect(() => {
    fetchPosts();

  }, []);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-2xl font-semibold">Posts</h1>
        <Button>Novo</Button></div><Card />
        <Card.Content />
          {loading ? (
            <div className="text-center py-8">Carregando posts...</div>
          ) : (
            <ul className="divide-y" />
              {(posts || []).map((post: unknown) => (
                <li key={post.id} className="py-3 flex items-center justify-between" />
                  <div className="truncate max-w-[70%]">{post.content}</div>
                  <div className="text-xs text-gray-500">{post.created_at}</div>
      </li>
    </>
  ))}
            </ul>
          )}
        </Card.Content></Card></div>);};

export default SocialPostsIndex;
