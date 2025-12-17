import React, { useState } from 'react';
import { FormBuilderToolbar, FormBuilderSidebar, FormBuilderCanvas, FormBuilderProperties } from './FormBuilderComponents';

interface FormElement {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean; }

const FormBuilder: React.FC = () => {
  const [elements, setElements] = useState<FormElement[]>([]);

  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);

  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const availableFields = [
    { type: 'text', label: 'Campo de Texto' },
    { type: 'email', label: 'Email' },
    { type: 'tel', label: 'Telefone' },
    { type: 'textarea', label: 'Área de Texto' },
    { type: 'select', label: 'Seleção' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'radio', label: 'Radio' },
    { type: 'date', label: 'Data' }
  ];

  const handleAddField = (field: unknown) => {
    const newElement: FormElement = {
      id: Date.now().toString(),
      type: field.type,
      label: field.label,
      placeholder: `Digite ${field.label.toLowerCase()}`,
      required: false};

    setElements([...elements, newElement]);};

  const handleElementClick = (element: FormElement) => {
    setSelectedElement(element);};

  const handleUpdateElement = (updated: FormElement) => {
    setElements(elements.map(el => el.id === updated.id ? updated : el));

    setSelectedElement(updated);};

  const handleSave = () => {};

  const handlePreview = () => {};

  const handleViewCode = () => {};

  return (
            <div className=" ">$2</div><FormBuilderToolbar
        onSave={ handleSave }
        onPreview={ handlePreview }
        onViewCode={ handleViewCode }
        deviceMode={ deviceMode }
        onDeviceModeChange={ setDeviceMode }
      / />
      <div className=" ">$2</div><FormBuilderSidebar
          fields={ availableFields }
          onAddField={ handleAddField }
        / />
        <FormBuilderCanvas
          elements={ elements }
          onElementClick={ handleElementClick }
        / />
        <FormBuilderProperties
          selectedElement={ selectedElement }
          onUpdate={ handleUpdateElement }
        / />
      </div>);};

export default FormBuilder;
