import React from 'react';
import Card from '@/shared/components/ui/Card';
interface PostPreviewProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Componente PostPreview
 *
 * @description
 * Renderiza preview do post em card formatado com título e conteúdo.
 * Preserva formatação do texto e exibe mensagem quando vazio.
 *
 * @param {PostPreviewProps} props - Props do componente
 * @returns {JSX.Element} Eye do post
 */
const PostPreview: React.FC<PostPreviewProps> = ({ text = '' 
   }) => (
  <Card />
    <Card.Header />
      <Card.Title>Prévia</Card.Title>
    </Card.Header>
    <Card.Content />
      <div className="{text || 'Sem conteúdo'}">$2</div>
      </div>
    </Card.Content>
  </Card>);

export default PostPreview;
