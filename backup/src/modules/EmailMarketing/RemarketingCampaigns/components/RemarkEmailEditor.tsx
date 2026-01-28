import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const RemarkEmailEditor: React.FC<{isOpen?: any, initialSubject?: any, initialContent?: any, onSave, onClose}> = ({ isOpen = true, initialSubject = '', initialContent = '', onSave, onClose }) => {
  const [subject, setSubject] = useState(String(initialSubject || ''));
  const [content, setContent] = useState(String(initialContent || ''));
  const handleSave = useCallback(() => {
    onSave?.({ subject, content });
    onClose?.();
  }, [content, onClose, onSave, subject]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editor de Email" size="lg">
      <Card>
        <Card.Content className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assunto</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <Textarea rows={10} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Digite o conteúdo do email..." />
          </div>
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};
RemarkEmailEditor.propTypes = {
  isOpen: PropTypes.bool,
  initialSubject: PropTypes.any,
  initialContent: PropTypes.any,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
};
export default RemarkEmailEditor;
