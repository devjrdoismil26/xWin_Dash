/**
 * @module LinkLeadModal
 * @description Modal para vincular um lead a um chat ou conversa do Aura.
 * 
 * Este componente exibe um modal com um seletor de leads dispon?veis,
 * permitindo vincular um lead espec?fico a uma conversa ou contexto.
 * 
 * @example
 * ```tsx
 * <LinkLeadModal
 *   open={ true }
 *   onClose={ () => setOpen(false) }
 *   leads={[
 *     { id: 1, name: "Jo?o Silva" },
 *     { id: 2, name: "Maria Santos" }
 *   ]}
 *   onLink={ (leadId: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Modal from '@/shared/components/ui/Modal';
import Card from '@/shared/components/ui/Card';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';

/**
 * Interface para um lead dispon?vel
 * 
 * @interface Lead
 * @property {string | number} id - ID ?nico do lead
 * @property {string} name - Nome do lead
 */
interface Lead {
  /** ID ?nico do lead */
  id: string | number;
  /** Nome do lead */
  name: string; }

/**
 * Interface para as propriedades do componente LinkLeadModal
 * 
 * @interface LinkLeadModalProps
 * @property {boolean} open - Se o modal est? aberto
 * @property {() => void} onClose - Callback chamado ao fechar o modal
 * @property {Lead[]} [leads] - Array de leads dispon?veis
 * @property {(leadId: string | number) => void} [onLink] - Callback chamado ao vincular um lead
 */
interface LinkLeadModalProps {
  /** Se o modal est? aberto */
open: boolean;
  /** Callback chamado ao fechar o modal */
onClose??: (e: any) => void;
  /** Array de leads dispon?veis */
leads?: Lead[];
  /** Callback chamado ao vincular um lead */
onLink??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente modal para vincular leads
 * 
 * @param {LinkLeadModalProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const LinkLeadModal: React.FC<LinkLeadModalProps> = ({ open, onClose, leads = [] as unknown[], onLink    }) => {
  const [leadId, setLeadId] = React.useState<string | number>('');

  return (
        <>
      <Modal isOpen={open} onClose={ onClose } />
      <Card />
        <Card.Header />
          <Card.Title>Vincular Lead</Card.Title>
        </Card.Header>
        <Card.Content className="space-y-3" />
          <Select 
            value={ String(leadId || '') }
            onChange={ (value: unknown) => setLeadId(value) }
            options={[
              { value: '', label: 'Selecione um lead' },
              ...(leads || []).map(l => ({ value: String(l.id), label: l.name }))
            ]} />
        </Card.Content>
        <Card.Footer className="flex gap-2 justify-end" />
          <Button variant="outline" onClick={ onClose }>Cancelar</Button>
          <Button onClick={ () => leadId && onLink?.(leadId) }>Vincular</Button>
        </Card.Footer></Card></Modal>);};

export default LinkLeadModal;
