/**
 * @module modules/Dashboard/components/widgets/SocialBufferWidget
 * @description
 * Widget de Social Buffer (agendamento de posts em redes sociais).
 * 
 * Exibe m?tricas de posts em redes sociais:
 * - Posts agendados
 * - Posts publicados
 * - Taxa de engajamento
 * - Alcance total
 * 
 * @example
 * ```typescript
 * <SocialBufferWidget
 *   data={
 *     scheduledPosts: 50,
 *     publishedPosts: 200,
 *     engagement: 5.2,
 *     reach: 50000
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { SocialBufferData, WidgetProps } from '@/types';

/**
 * Props do widget de Social Buffer
 * @interface SocialBufferWidgetProps
 * @extends WidgetProps
 */
interface SocialBufferWidgetProps extends WidgetProps {
  /** Dados do Social Buffer */
  data?: SocialBufferData;
}

/**
 * Componente widget de Social Buffer
 * @param {SocialBufferWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de Social Buffer
 */
const SocialBufferWidget: React.FC<SocialBufferWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Social Buffer</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Social Buffer</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Social Buffer</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Agendados: {(data.scheduledPosts || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Publicados: {(data.publishedPosts || 0).toLocaleString('pt-BR')}</div>
          {data.engagement && (
            <div>Engajamento: {data.engagement.toFixed(1)}%</div>
          )}
          {data.reach && (
            <div>Alcance: {data.reach.toLocaleString('pt-BR')}</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default SocialBufferWidget;
