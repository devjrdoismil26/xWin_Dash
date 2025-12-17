import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Modal from '@/shared/components/ui/Modal';
import ScrollArea from '@/shared/components/ui/ScrollArea';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { EmptyState } from '@/shared/components/ui/EmptyState';
const AudienceSelector: React.FC<{isOpen?: string, onClose, onSelect}> = ({ isOpen = true, onClose, onSelect    }) => {
  const [segments, setSegments] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedId, setSelectedId] = useState<any>(null);

  const loadSegments = useCallback(async () => {
    setIsLoading(true);

    try {
      const url = route ? route('email-segments.index') : '/api/email-marketing/segments';
      const response = await axios.get(url);

      setSegments(response?.data?.data ?? []);

    } catch (error) {
      toast.error('Erro ao carregar segmentos.');

    } finally {
      setIsLoading(false);

    } , []);

  useEffect(() => {
    if (!isOpen) return;
    loadSegments();

  }, [isOpen, loadSegments]);

  const handleConfirm = useCallback(() => {
    if (!selectedId) {
      toast.warning('Selecione um segmento.');

      return;
    }
    onSelect?.(selectedId);

    onClose?.();

  }, [onClose, onSelect, selectedId]);

  return (
        <>
      <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Segmento" />
      <Card />
        <Card.Content />
          {isLoading ? (
            <LoadingSpinner text="Carregando segmentos..." / />
          ) : segments.length === 0 ? (
            <EmptyState text="Nenhum segmento disponível." / />
          ) : (
            <ScrollArea className="max-h-80 pr-2" />
              <div className="{(segments || []).map((segment: unknown) => (">$2</div>
                  <Card key={segment.id} className={`p-3 cursor-pointer ${selectedId === segment.id ? 'ring-2 ring-blue-500' : ''} `}
                    onClick={ () => setSelectedId(segment.id)  }>
                    <div className=" ">$2</div><div>
           
        </div><h3 className="font-medium">{segment.name}</h3>
                        <p className="text-xs text-gray-600">{segment.description || 'Sem descrição'}</p></div><input
                        type="radio"
                        checked={ selectedId === segment.id }
                        onChange={ () => setSelectedId(segment.id) } /></div></Card>
                ))}
              </div>
      </ScrollArea>
    </>
  )}
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2" />
          <Button variant="outline" onClick={ onClose }>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={ !selectedId }>Selecionar</Button>
        </Card.Footer></Card></Modal>);};

AudienceSelector.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,};

export default AudienceSelector;
