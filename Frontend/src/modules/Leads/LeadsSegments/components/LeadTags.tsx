import React, { useState } from 'react';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { LeadTagsProps, LeadTag } from '../types';
import { toast } from 'sonner';
const LeadTags: React.FC<LeadTagsProps> = ({ tags, 
  selectedTags, 
  onTagsChange, 
  onTagCreate 
   }) => {
  const [newTagName, setNewTagName] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  const handleTagToggle = (tagName: string) => {
    const isSelected = selectedTags.includes(tagName);

    if (isSelected) {
      onTagsChange((selectedTags || []).filter(tag => tag !== tagName));

    } else {
      onTagsChange([...selectedTags, tagName]);

    } ;

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Nome da tag é obrigatório');

      return;
    }
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      toast.error('Tag já existe');

      return;
    }
    setIsCreating(true);

    try {
      await onTagCreate?.(newTagName.trim());

      setNewTagName('');

      toast.success('Tag criada com sucesso!');

    } catch (error) {
      toast.error('Erro ao criar tag. Tente novamente.');

    } finally {
      setIsCreating(false);

    } ;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      handleCreateTag();

    } ;

  return (
            <div className="{/* Tags Disponíveis */}">$2</div>
      <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-2">Tags Disponíveis</h4>
        <div className="{(tags || []).map((tag: unknown) => {">$2</div>
            const isSelected = selectedTags.includes(tag.name);

            return (
                      <button
                key={ tag.id }
                onClick={ () => handleTagToggle(tag.name) }
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                } `}
  >
                {tag.name}
                {isSelected && (
                  <span className="ml-1 text-blue-600">✓</span>
                )}
              </button>);

          })}
        </div>
      {/* Tags Selecionadas */}
      {selectedTags.length > 0 && (
        <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-2">Tags Selecionadas</h4>
          <div className="{(selectedTags || []).map((tagName: unknown) => (">$2</div>
              <Badge key={tagName} variant="primary" className="pr-1" />
                {tagName}
                <button
                  type="button"
                  onClick={ () => handleTagToggle(tagName) }
                  className="ml-1 text-current hover:text-red-600"
                >
                  ×
                </button>
      </Badge>
    </>
  ))}
          </div>
      )}
      {/* Criar Nova Tag */}
      {onTagCreate && (
        <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-2">Criar Nova Tag</h4>
          <div className=" ">$2</div><Input
              placeholder="Nome da nova tag"
              value={ newTagName }
              onChange={ (e: unknown) => setNewTagName(e.target.value) }
              onKeyPress={ handleKeyPress }
              className="flex-1" />
            <Button
              onClick={ handleCreateTag }
              disabled={ isCreating || !newTagName.trim() }
              loading={ isCreating }
              loadingText="Criando..." />
              Criar
            </Button>
      </div>
    </>
  )}
      {/* Estatísticas */}
      <div className="{selectedTags.length} de {tags.length} tags selecionadas">$2</div>
      </div>);};

export default LeadTags;
