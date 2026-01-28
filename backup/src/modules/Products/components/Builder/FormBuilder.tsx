// ========================================
// PRODUCTS MODULE - FORM BUILDER
// ========================================
import React, { useState, useCallback, useRef } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Copy, 
  Trash2, 
  Plus, 
  Settings, 
  Type, 
  Mail, 
  Phone, 
  Hash, 
  List, 
  CheckSquare, 
  Radio, 
  FileText, 
  Calendar, 
  Upload,
  MousePointer,
  Move,
  RotateCcw,
  Download,
  Code,
  Preview
} from 'lucide-react';
import { 
  LeadCaptureForm, 
  FormField, 
  FieldType,
  FormSettings,
  FormStyling
} from '../../types/products';
import { cn } from '@/lib/utils';
interface FormBuilderProps {
  form: LeadCaptureForm;
  onSave: (form: LeadCaptureForm) => void;
  onPreview: () => void;
  onPublish: () => void;
  className?: string;
}
export const FormBuilder: React.FC<FormBuilderProps> = ({
  form,
  onSave,
  onPreview,
  onPublish,
  className
}) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<LeadCaptureForm>(form);
  // Field type options
  const fieldTypes = [
    { type: FieldType.TEXT, label: 'Text Input', icon: Type, description: 'Single line text input' },
    { type: FieldType.EMAIL, label: 'Email', icon: Mail, description: 'Email address input' },
    { type: FieldType.PHONE, label: 'Phone', icon: Phone, description: 'Phone number input' },
    { type: FieldType.NUMBER, label: 'Number', icon: Hash, description: 'Numeric input' },
    { type: FieldType.SELECT, label: 'Select', icon: List, description: 'Dropdown selection' },
    { type: FieldType.MULTISELECT, label: 'Multi Select', icon: List, description: 'Multiple selection' },
    { type: FieldType.CHECKBOX, label: 'Checkbox', icon: CheckSquare, description: 'Checkbox input' },
    { type: FieldType.RADIO, label: 'Radio', icon: Radio, description: 'Radio button group' },
    { type: FieldType.TEXTAREA, label: 'Textarea', icon: FileText, description: 'Multi-line text input' },
    { type: FieldType.DATE, label: 'Date', icon: Calendar, description: 'Date picker' },
    { type: FieldType.FILE, label: 'File Upload', icon: Upload, description: 'File upload input' }
  ];
  // Field management
  const addField = useCallback((type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: getDefaultFieldLabel(type),
      placeholder: getDefaultFieldPlaceholder(type),
      required: false,
      validation: getDefaultFieldValidation(type),
      options: getDefaultFieldOptions(type),
      order: formData.fields.length
    };
    const newFormData = {
      ...formData,
      fields: [...formData.fields, newField]
    };
    setFormData(newFormData);
  }, [formData]);
  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    const newFormData = {
      ...formData,
      fields: formData.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    };
    setFormData(newFormData);
  }, [formData]);
  const deleteField = useCallback((fieldId: string) => {
    const newFormData = {
      ...formData,
      fields: formData.fields.filter(field => field.id !== fieldId)
    };
    setFormData(newFormData);
  }, [formData]);
  const duplicateField = useCallback((fieldId: string) => {
    const field = formData.fields.find(f => f.id === fieldId);
    if (!field) return;
    const newField: FormField = {
      ...field,
      id: `field-${Date.now()}`,
      order: formData.fields.length
    };
    const newFormData = {
      ...formData,
      fields: [...formData.fields, newField]
    };
    setFormData(newFormData);
  }, [formData]);
  const reorderFields = useCallback((fromIndex: number, toIndex: number) => {
    const newFields = [...formData.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    const newFormData = {
      ...formData,
      fields: newFields.map((field, index) => ({
        ...field,
        order: index
      }))
    };
    setFormData(newFormData);
  }, [formData]);
  // Drag and drop
  const handleDragStart = useCallback((e: React.DragEvent, fieldType: FieldType) => {
    e.dataTransfer.setData('text/plain', fieldType);
    setIsDragging(true);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('text/plain') as FieldType;
    if (fieldType) {
      addField(fieldType);
    }
    setIsDragging(false);
  }, [addField]);
  // Save and publish
  const handleSave = useCallback(() => {
    onSave(formData);
  }, [formData, onSave]);
  const handlePreview = useCallback(() => {
    onPreview();
  }, [onPreview]);
  const handlePublish = useCallback(() => {
    onPublish();
  }, [onPublish]);
  // Default field generators
  const getDefaultFieldLabel = (type: FieldType) => {
    switch (type) {
      case FieldType.TEXT: return 'Text Input';
      case FieldType.EMAIL: return 'Email Address';
      case FieldType.PHONE: return 'Phone Number';
      case FieldType.NUMBER: return 'Number';
      case FieldType.SELECT: return 'Select Option';
      case FieldType.MULTISELECT: return 'Select Multiple';
      case FieldType.CHECKBOX: return 'Checkbox';
      case FieldType.RADIO: return 'Radio Button';
      case FieldType.TEXTAREA: return 'Message';
      case FieldType.DATE: return 'Date';
      case FieldType.FILE: return 'File Upload';
      default: return 'Field';
    }
  };
  const getDefaultFieldPlaceholder = (type: FieldType) => {
    switch (type) {
      case FieldType.TEXT: return 'Enter text...';
      case FieldType.EMAIL: return 'Enter your email...';
      case FieldType.PHONE: return 'Enter your phone number...';
      case FieldType.NUMBER: return 'Enter a number...';
      case FieldType.SELECT: return 'Select an option...';
      case FieldType.MULTISELECT: return 'Select multiple options...';
      case FieldType.TEXTAREA: return 'Enter your message...';
      case FieldType.DATE: return 'Select a date...';
      case FieldType.FILE: return 'Choose a file...';
      default: return 'Enter value...';
    }
  };
  const getDefaultFieldValidation = (type: FieldType) => {
    switch (type) {
      case FieldType.EMAIL: return { pattern: '^[^@]+@[^@]+\\.[^@]+$', customMessage: 'Please enter a valid email address' };
      case FieldType.PHONE: return { pattern: '^[\\+]?[1-9][\\d]{0,15}$', customMessage: 'Please enter a valid phone number' };
      case FieldType.NUMBER: return { min: 0, max: 999999 };
      default: return {};
    }
  };
  const getDefaultFieldOptions = (type: FieldType) => {
    switch (type) {
      case FieldType.SELECT:
      case FieldType.MULTISELECT:
        return ['Option 1', 'Option 2', 'Option 3'];
      case FieldType.RADIO:
        return ['Option 1', 'Option 2', 'Option 3'];
      default:
        return undefined;
    }
  };
  const getFieldIcon = (type: FieldType) => {
    const fieldType = fieldTypes.find(ft => ft.type === type);
    return fieldType ? fieldType.icon : Type;
  };
  const renderField = (field: FormField) => {
    const Icon = getFieldIcon(field.type);
    switch (field.type) {
      case FieldType.TEXT:
      case FieldType.EMAIL:
      case FieldType.PHONE:
      case FieldType.NUMBER:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type === FieldType.EMAIL ? 'email' : field.type === FieldType.NUMBER ? 'number' : 'text'}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case FieldType.SELECT:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">{field.placeholder}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      case FieldType.MULTISELECT:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case FieldType.CHECKBOX:
        return (
          <div className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <label className="text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
          </div>
        );
      case FieldType.RADIO:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input type="radio" name={field.id} className="mr-2" />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case FieldType.TEXTAREA:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case FieldType.DATE:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case FieldType.FILE:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
    }
  };
  return (
    <div className={cn('flex h-screen bg-gray-100', className)}>
      {/* Sidebar - Field Types */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Field Types</h2>
          <p className="text-sm text-gray-600">Drag and drop to add fields</p>
        </div>
        {/* Field Types */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {fieldTypes.map((fieldType) => {
              const Icon = fieldType.icon;
              return (
                <div
                  key={fieldType.type}
                  className="p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition-colors"
                  draggable
                  onDragStart={(e) => handleDragStart(e, fieldType.type)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{fieldType.label}</p>
                      <p className="text-sm text-gray-600">{fieldType.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">{formData.title}</h1>
              <Badge variant="outline">{formData.fields.length} fields</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button size="sm" onClick={handlePublish}>
                <Upload className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h2>
                {formData.description && (
                  <p className="text-gray-600">{formData.description}</p>
                )}
              </div>
              {/* Form Fields */}
              <div className="space-y-6">
                {formData.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={cn(
                      'relative group border-2 border-transparent hover:border-blue-300 transition-colors p-4 rounded-lg',
                      selectedField === field.id && 'border-blue-500 bg-blue-50'
                    )}
                    onMouseEnter={() => setHoveredField(field.id)}
                    onMouseLeave={() => setHoveredField(null)}
                    onClick={() => setSelectedField(field.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {/* Field Content */}
                    {renderField(field)}
                    {/* Field Controls */}
                    {(selectedField === field.id || hoveredField === field.id) && (
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => duplicateField(field.id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteField(field.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {/* Field Label */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                    </div>
                  </div>
                ))}
                {/* Empty State */}
                {formData.fields.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">Drag fields here to build your form</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Submit Button */}
              {formData.fields.length > 0 && (
                <div className="mt-8 text-center">
                  <Button size="lg" className="px-8">
                    {formData.settings.submitText}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      {/* Sidebar - Properties */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-600">
            {selectedField ? 'Edit selected field' : 'Select a field to edit'}
          </p>
        </div>
        {/* Properties Panel */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedField ? (
            <div className="space-y-4">
              {(() => {
                const field = formData.fields.find(f => f.id === selectedField);
                if (!field) return null;
                return (
                  <>
                    {/* Field Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Type
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                      >
                        {fieldTypes.map((type) => (
                          <option key={type.type} value={type.type}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Field Label */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                      />
                    </div>
                    {/* Placeholder */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      />
                    </div>
                    {/* Required */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Required field
                      </label>
                    </div>
                    {/* Options for select/radio fields */}
                    {(field.type === FieldType.SELECT || field.type === FieldType.MULTISELECT || field.type === FieldType.RADIO) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options
                        </label>
                        <div className="space-y-2">
                          {field.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(field.options || [])];
                                  newOptions[index] = e.target.value;
                                  updateField(field.id, { options: newOptions });
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newOptions = field.options?.filter((_, i) => i !== index);
                                  updateField(field.id, { options: newOptions });
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newOptions = [...(field.options || []), 'New Option'];
                              updateField(field.id, { options: newOptions });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      </div>
                    )}
                    {/* Validation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validation
                      </label>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            placeholder="Min Length"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={field.validation?.minLength || ''}
                            onChange={(e) => updateField(field.id, { 
                              validation: { ...field.validation, minLength: Number(e.target.value) }
                            })}
                          />
                          <input
                            type="number"
                            placeholder="Max Length"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={field.validation?.maxLength || ''}
                            onChange={(e) => updateField(field.id, { 
                              validation: { ...field.validation, maxLength: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Custom Error Message"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={field.validation?.customMessage || ''}
                          onChange={(e) => updateField(field.id, { 
                            validation: { ...field.validation, customMessage: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No Field Selected</p>
              <p className="text-sm">Click on a field to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
