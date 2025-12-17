import React from 'react';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
import { MediaFile } from '../types/mediaLibraryTypes';

interface MediaBasicFormProps {
  formData: Partial<MediaFile>;
  onChange?: (e: any) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void; }

export const MediaBasicForm: React.FC<MediaBasicFormProps> = ({
  formData,
  onChange,
  errors = {},
  disabled = false
}) => {
  return (
            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
          Nome *
        </label>
        <Input
          value={ formData.name || '' }
          onChange={ (e: unknown) => onChange('name', e.target.value) }
          disabled={ disabled }
          error={ errors.name } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
          Texto Alternativo
        </label>
        <Input
          value={ formData.alt_text || '' }
          onChange={ (e: unknown) => onChange('alt_text', e.target.value) }
          disabled={ disabled } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
          Legenda
        </label>
        <Input
          value={ formData.caption || '' }
          onChange={ (e: unknown) => onChange('caption', e.target.value) }
          disabled={ disabled } /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
          Descrição
        </label>
        <Textarea
          value={ formData.description || '' }
          onChange={ (e: unknown) => onChange('description', e.target.value) }
          disabled={ disabled }
          rows={ 4 } />
      </div>);};
