/**
 * StandardCard - Card com estilos padronizados
 * Aplica automaticamente o glass effect e estilos consistentes
 */
import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

interface StandardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary'; }

export const StandardCard: React.FC<StandardCardProps> = ({ children,
  className,
  variant = 'default'
   }) => {
  const baseClasses = 'backdrop-blur-xl border';
  
  const variantClasses = {
    default: 'bg-white/10 border-white/20',
    secondary: 'bg-white/5 border-white/10'};

  return (
            <Card className={cn(baseClasses, variantClasses[variant], className) } />
      {children}
    </Card>);};

// Subcomponentes com padding padronizado
StandardCard.Header = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card.Header className={cn('p-6', className) } />
    {children}
  </Card.Header>);

StandardCard.Content = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card.Content className={cn('p-6', className) } />
    {children}
  </Card.Content>);

StandardCard.Title = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card.Title className={cn('text-white font-bold', className) } />
    {children}
  </Card.Title>);

// Export as GlassCard for compatibility
export const GlassCard = StandardCard;
export default StandardCard;
