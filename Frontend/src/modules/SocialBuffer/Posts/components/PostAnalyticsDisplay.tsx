import React from 'react';
import Card from '@/shared/components/ui/Card';

/**
 * Interface para dados de analytics de post
 */
interface PostAnalytics {
  impressions?: number;
  reach?: number;
  engagement?: number;
  clicks?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  video_views?: number;
  [key: string]: unknown; }

interface PostAnalyticsDisplayProps {
  analytics?: PostAnalytics;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente PostAnalyticsDisplay
 *
 * @description
 * Renderiza card com analytics formatados em JSON.
 * Exibe dados de métricas do post de forma legível.
 *
 * @param {PostAnalyticsDisplayProps} props - Props do componente
 * @returns {JSX.Element} Display de analytics
 */
const PostAnalyticsDisplay: React.FC<PostAnalyticsDisplayProps> = ({ 
  analytics ={  } ) => (
  <Card />
    <Card.Header />
      <Card.Title>Métricas</Card.Title>
    </Card.Header>
    <Card.Content />
      <pre className="text-xs bg-gray-50 p-2 rounded" />
        {JSON.stringify(analytics, null, 2)}
      </pre>
    </Card.Content>
  </Card>);

export default PostAnalyticsDisplay;
