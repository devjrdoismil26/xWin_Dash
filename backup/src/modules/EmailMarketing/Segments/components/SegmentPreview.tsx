import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ScrollArea from '@/components/ui/ScrollArea';
import { Table } from '@/components/ui/Table';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
const SegmentPreview = ({ segment, isOpen = true, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    // Placeholder: carregar leads de exemplo
    setTimeout(() => {
      setLeads([]);
      setIsLoading(false);
    }, 200);
  }, [segment]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prévia do Segmento" size="lg">
      <Card>
        <Card.Content>
          {isLoading ? (
            <LoadingSpinner text="Carregando leads..." />
          ) : (
            <ScrollArea className="max-h-[60vh] pr-2">
              <Table columns={[{ key: 'email', title: 'Email' }, { key: 'name', title: 'Nome' }]} data={leads} />
            </ScrollArea>
          )}
        </Card.Content>
      </Card>
    </Modal>
  );
};
SegmentPreview.propTypes = {
  segment: PropTypes.any,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
export default SegmentPreview;
