import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/components/ui/Button';
import Card from '@/shared/components/ui/Card';
const PersonalizationTags: React.FC<{tags?: string, onInsert, onClose}> = ({ tags = [] as unknown[], onInsert, onClose    }) => {
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Inserir variáveis</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className="{tags.length > 0 ? (">$2</div>
            (tags || []).map((item: unknown) => (
              <Button
                key={ item.tag }
                type="button"
                variant="secondary"
                size="sm"
                onClick={ () => onInsert?.(item.tag)  }>
                {item.name} ({item.tag})
              </Button>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma tag disponível</p>
          )}
        </div>
        <div className=" ">$2</div><Button variant="outline" size="sm" onClick={ () => onClose?.() }>Fechar</Button></div></Card.Content>
    </Card>);};

PersonalizationTags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      tag: PropTypes.string,
    })
  ),
  onInsert: PropTypes.func,
  onClose: PropTypes.func,};

export default PersonalizationTags;
