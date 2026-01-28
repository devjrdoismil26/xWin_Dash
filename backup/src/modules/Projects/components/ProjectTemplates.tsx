import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  RefreshCw,
  Star,
  Users,
  Calendar,
  Tag,
  Eye,
  Copy,
  File,
  Download
} from 'lucide-react';
import { useProjectTemplates } from '../ProjectsAdvanced/hooks/templates/useProjectTemplates';
import { ProjectTemplateAdvanced } from '../types/projectsTypes';

interface ProjectTemplatesProps {
  onTemplateSelect?: (template: ProjectTemplateAdvanced) => void;
}

const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({ onTemplateSelect }) => {
  const {
    templates,
    loading,
    error,
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
  } = useProjectTemplates();

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplateAdvanced | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'business',
    tags: [] as string[],
    is_public: false
  });

  const handleCreateTemplate = async () => {
    const result = await createTemplate(formData);
    if (result) {
      setShowForm(false);
      resetForm();
    }
  };

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return;
    
    const result = await updateTemplate(editingTemplate.id, formData);
    if (result) {
      setEditingTemplate(null);
      setShowForm(false);
      resetForm();
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      await deleteTemplate(templateId);
    }
  };

  const handleEditTemplate = (template: ProjectTemplateAdvanced) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      tags: template.tags,
      is_public: template.is_public
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'business',
      tags: [],
      is_public: false
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      business: 'bg-blue-100 text-blue-800',
      marketing: 'bg-green-100 text-green-800',
      development: 'bg-purple-100 text-purple-800',
      design: 'bg-pink-100 text-pink-800',
      sales: 'bg-orange-100 text-orange-800',
      support: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      business: 'Negócios',
      marketing: 'Marketing',
      development: 'Desenvolvimento',
      design: 'Design',
      sales: 'Vendas',
      support: 'Suporte',
      other: 'Outros'
    };
    return names[category] || category;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading && templates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <File className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Templates de Projetos
              </h3>
              <p className="text-sm text-gray-500">
                {templates.length} templates disponíveis
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={getTemplates}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingTemplate(null);
                resetForm();
              }}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {templates.length === 0 ? (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum template disponível
            </h4>
            <p className="text-gray-500 mb-4">
              Crie templates para acelerar a criação de novos projetos
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Criar Primeiro Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => onTemplateSelect?.(template)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      title="Usar template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="p-1 text-gray-400 hover:text-yellow-600"
                      title="Editar template"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Excluir template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                      {getCategoryName(template.category)}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(template.rating)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{template.usage_count} usos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(template.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{template.tags.length - 3} mais
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        por {template.created_by_name}
                      </span>
                      {template.is_public && (
                        <span className="text-xs text-green-600 font-medium">
                          Público
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                  resetForm();
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Template
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Template de Projeto Web"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descreva o template..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="business">Negócios</option>
                  <option value="marketing">Marketing</option>
                  <option value="development">Desenvolvimento</option>
                  <option value="design">Design</option>
                  <option value="sales">Vendas</option>
                  <option value="support">Suporte</option>
                  <option value="other">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: web, mobile, e-commerce"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Template público (visível para outros usuários)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTemplate(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingTemplate ? 'Atualizar' : 'Criar'} Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTemplates;
