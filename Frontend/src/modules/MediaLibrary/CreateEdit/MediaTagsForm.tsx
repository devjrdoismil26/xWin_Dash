import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import Badge from '@/shared/components/ui/Badge';
import { MediaTag } from '../types/mediaLibraryTypes';

interface MediaTagsFormProps {
  selectedTags: string[];
  availableTags: MediaTag[];
  onAddTag?: (e: any) => void;
  onRemoveTag?: (e: any) => void;
  onCreateTag?: (e: any) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const MediaTagsForm: React.FC<MediaTagsFormProps> = ({ selectedTags,
  availableTags,
  onAddTag,
  onRemoveTag,
  onCreateTag,
  disabled = false
   }) => {
  const [newTag, setNewTag] = useState('');

  const handleCreateTag = () => {
    if (newTag.trim()) {
      onCreateTag(newTag.trim());

      setNewTag('');

    } ;

  return (
            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
          Tags Selecionadas
        </label>
        <div className="{selectedTags.length === 0 ? (">$2</div>
            <p className="text-sm text-gray-500">Nenhuma tag selecionada</p>
          ) : (
            selectedTags.map(tag => (
              <Badge key={tag} variant="default" />
                {tag}
                {!disabled && (
                  <button
                    onClick={ () => onRemoveTag(tag) }
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))
          )}
        </div>

      {!disabled && (
        <>
          <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
              Tags Disponíveis
            </label>
            <div className="{availableTags">$2</div>
                .filter(tag => !selectedTags.includes(tag.name))
                .map(tag => (
                  <Badge
                    key={ tag.id }
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={ () => onAddTag(tag.name)  }>
                    {tag.name}
                    <Plus className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
            </div>

          <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2" />
              Criar Nova Tag
            </label>
            <div className=" ">$2</div><Input
                value={ newTag }
                onChange={ (e: unknown) => setNewTag(e.target.value) }
                placeholder="Nome da tag"
                onKeyPress={ (e: unknown) => e.key === 'Enter' && handleCreateTag() } />
              <Button onClick={handleCreateTag} disabled={ !newTag.trim() } />
                <Plus className="w-4 h-4" /></Button></div>
      </>
    </>
  )}
    </div>);};
