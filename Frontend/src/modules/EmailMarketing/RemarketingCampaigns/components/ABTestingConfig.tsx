import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Modal from '@/shared/components/ui/Modal';
import ScrollArea from '@/shared/components/ui/ScrollArea';
import Textarea from '@/shared/components/ui/Textarea';
const ABTestingConfig: React.FC<{onSave, onClose}> = ({ onSave, onClose    }) => {
  const [variants, setVariants] = useState([
    { name: 'Variante A', subject: '', content: '', percentage: 50 },
    { name: 'Variante B', subject: '', content: '', percentage: 50 },
  ]);

  const totalPercentage = useMemo(
    () => variants.reduce((acc: unknown, v: unknown) => acc + Number(v.percentage || 0), 0),
    [variants]);

  const handleVariantChange = useCallback((index: unknown, field: unknown, value: unknown) => {
    setVariants((prev: unknown) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value};

      return next;
    });

  }, []);

  const handleSave = useCallback(() => {
    if (totalPercentage !== 100) {
      toast.error('A soma das porcentagens deve ser exatamente 100%.');

      return;
    }
    onSave?.(variants);

    toast.success('Configuração de A/B salva.');

    onClose?.();

  }, [onClose, onSave, totalPercentage, variants]);

  return (
        <>
      <Modal isOpen onClose={onClose} title="Configurar Teste A/B" size="lg" />
      <Card />
        <Card.Content />
          <div className="mb-4 text-sm text-gray-600">Percentual total: {totalPercentage}%</div>
          <ScrollArea className="max-h-[60vh] pr-2" />
            <div className="{(variants || []).map((variant: unknown, index: unknown) => (">$2</div>
                <Card key={index} className="p-4" />
                  <div className=" ">$2</div><div>
           
        </div><InputLabel>Nome</InputLabel>
                      <Input
                        value={ variant.name }
                        onChange={ (e: unknown) => handleVariantChange(index, 'name', e.target.value) }
                        placeholder={`Variante ${index === 0 ? 'A' : 'B'}`} /></div><div>
           
        </div><InputLabel>Assunto</InputLabel>
                      <Input
                        value={ variant.subject }
                        onChange={ (e: unknown) => handleVariantChange(index, 'subject', e.target.value) }
                        placeholder="Assunto do email" /></div><div>
           
        </div><InputLabel>% Tráfego</InputLabel>
                      <Input
                        type="number"
                        min={ 0 }
                        max={ 100 }
                        value={ variant.percentage }
                        onChange={ (e: unknown) => handleVariantChange(index, 'percentage', Number(e.target.value)) } /></div><div>
           
        </div><InputLabel>Conteúdo</InputLabel>
                    <Textarea
                      value={ variant.content }
                      onChange={ (e: unknown) => handleVariantChange(index, 'content', e.target.value) }
                      placeholder="HTML ou texto da variante"
                      rows={ 6 } /></div></Card>
              ))}
            </div></ScrollArea></Card.Content>
        <Card.Footer className="flex justify-end gap-2" />
          <Button variant="outline" onClick={ onClose }>Cancelar</Button>
          <Button onClick={ handleSave }>Salvar</Button>
        </Card.Footer></Card></Modal>);};

ABTestingConfig.propTypes = {
  onSave: PropTypes.func,
  onClose: PropTypes.func,};

export default ABTestingConfig;
