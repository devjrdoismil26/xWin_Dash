import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@/shared/components/ui/Modal';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
interface CampaignCreatorProps {
  isOpen?: boolean;
  onClose??: (e: any) => void;
  onCampaignCreated?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const CampaignCreator: React.FC<CampaignCreatorProps> = ({ isOpen = true, onClose, onCampaignCreated    }) => {
  const [form, setForm] = useState({
    name: '',
    subject: '',
    from_name: '',
    from_email: '',
    content: '',
  });

  const submit: React.FC<e> = (e: unknown) => {
    e?.preventDefault?.();

    onCampaignCreated?.({ id: Date.now(), ...form });};

  return (
            <Modal isOpen={isOpen} onClose={() => onClose?.()} title="Nova Campanha" size="lg">
      <form onSubmit={submit} className="space-y-3" />
        <div>
           
        </div><InputLabel htmlFor="camp-name">Nome</InputLabel>
          <Input id="camp-name" value={form.name} onChange={(e: unknown) => setForm({ ...form, name: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="camp-subject">Assunto</InputLabel>
          <Input id="camp-subject" value={form.subject} onChange={(e: unknown) => setForm({ ...form, subject: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="camp-from-name">Remetente</InputLabel>
          <Input id="camp-from-name" value={form.from_name} onChange={(e: unknown) => setForm({ ...form, from_name: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="camp-from-email">Email do remetente</InputLabel>
          <Input id="camp-from-email" value={form.from_email} onChange={(e: unknown) => setForm({ ...form, from_email: e.target.value })} /></div><div>
           
        </div><InputLabel htmlFor="camp-content">Conteúdo</InputLabel>
          <Textarea id="camp-content" rows={6} value={form.content} onChange={(e: unknown) => setForm({ ...form, content: e.target.value })} /></div><div className=" ">$2</div><Button type="button" variant="outline" onClick={ () => onClose?.() }>Cancelar</Button>
          <Button type="submit">Criar</Button></div></form>
    </Modal>);};

CampaignCreator.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onCampaignCreated: PropTypes.func,};

export default CampaignCreator;
