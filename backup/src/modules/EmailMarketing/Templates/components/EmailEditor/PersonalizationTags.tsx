import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
const PersonalizationTags: React.FC<{tags?: any, onInsert, onClose}> = ({ tags = [], onInsert, onClose }) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Inserir variáveis</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.length > 0 ? (
            tags.map((item) => (
              <Button
                key={item.tag}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onInsert?.(item.tag)}
              >
                {item.name} ({item.tag})
              </Button>
            ))
          ) : (
            <p className="text-sm text-gray-500">Nenhuma tag disponível</p>
          )}
        </div>
        <div className="text-right">
          <Button variant="outline" size="sm" onClick={() => onClose?.()}>Fechar</Button>
        </div>
      </Card.Content>
    </Card>
  );
};
PersonalizationTags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      tag: PropTypes.string,
    })
  ),
  onInsert: PropTypes.func,
  onClose: PropTypes.func,
};
export default PersonalizationTags;
