import React from 'react';

// Types
interface FormField {
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean; }

interface FormElement extends FormField {
  id: string;
}

interface FormBuilderSidebarProps {
  fields: FormField[];
  onAddField?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface FormBuilderCanvasProps {
  elements: FormElement[];
  onElementClick?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }

interface FormBuilderPropertiesProps {
  selectedElement: FormElement | null;
  onUpdate?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }

// FormBuilderSidebar.tsx
export const FormBuilderSidebar: React.FC<FormBuilderSidebarProps> = ({ fields, onAddField    }) => (
  <div className=" ">$2</div><h3 className="font-semibold mb-4">Campos</h3>
    <div className="{fields.map((field: unknown) => (">$2</div>
        <button
          key={ field.type }
          onClick={ () => onAddField(field) }
          className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
        >
          {field.label}
        </button>
      ))}
    </div>);

// FormBuilderCanvas.tsx
export const FormBuilderCanvas: React.FC<FormBuilderCanvasProps> = ({ elements, onElementClick    }) => (
  <div className=" ">$2</div><div className="{elements.length === 0 ? (">$2</div>
        <div className="Arraste campos da barra lateral">$2</div>
    </div>
  ) : (
        <div className="{elements.map((el: unknown) => (">$2</div>
            <div
              key={ el.id }
              onClick={ () => onElementClick(el) }
              className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
            >
              <label className="block text-sm font-medium mb-2">{el.label}</label>
              <input
                type={ el.type }
                placeholder={ el.placeholder }
                className="w-full px-3 py-2 border rounded-lg"
                disabled
              / />
            </div>
          ))}
        </div>
      )}
    </div>);

// FormBuilderProperties.tsx
export const FormBuilderProperties: React.FC<FormBuilderPropertiesProps> = ({ selectedElement, onUpdate    }) => {
  if (!selectedElement) {
    return (
              <div className=" ">$2</div><p className="text-gray-500 text-center">Selecione um elemento</p>
      </div>);

  }

  return (
            <div className=" ">$2</div><h3 className="font-semibold mb-4">Propriedades</h3>
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium mb-2">Label</label>
          <input
            type="text"
            value={ selectedElement.label }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...selectedElement, label: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg" /></div><div>
           
        </div><label className="block text-sm font-medium mb-2">Placeholder</label>
          <input
            type="text"
            value={ selectedElement.placeholder || '' }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...selectedElement, placeholder: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg" /></div><div>
           
        </div><label className="flex items-center gap-2" />
            <input
              type="checkbox"
              checked={ selectedElement.required || false }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate({ ...selectedElement, required: e.target.checked })} />
            <span className="text-sm">Campo obrigatório</span></label></div>
    </div>);};

export { FormBuilderToolbar } from './FormBuilderToolbar';
