// ========================================
// LEADS CREATE PAGE - PÁGINA DE CRIAÇÃO
// ========================================
// Página para criar novos leads
// Máximo: 200 linhas

import React, { Suspense, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Save, Eye, X } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { useLeads } from '../hooks/useLeads';
import { LeadForm } from '../LeadsManager/components/LeadForm';
import { LeadsHeader } from '../components/LeadsHeader';
import { LeadsFilters } from '../components/LeadsFilters';
import { LeadsMetrics } from '../components/LeadsMetrics';

// ========================================
// INTERFACES
// ========================================

interface LeadsCreatePageProps {
  className?: string;
  initialData?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// ========================================
// COMPONENTES LAZY LOADED
// ========================================

const LeadTemplateSelector = React.lazy(() => import('../LeadsManager/components/LeadForm'));

const LeadImportWizard = React.lazy(() => import('../LeadsManager/components/LeadImportExport'));

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export const LeadsCreatePage: React.FC<LeadsCreatePageProps> = ({ className = '',
  initialData
   }) => {
  const {
    loading,
    error,
    customFields,
    createLead,
    clearError
  } = useLeads();

  // ========================================
  // STATE
  // ========================================
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    position: '',
    status: 'new',
    origin: 'website',
    project_id: 1,
    assigned_to: null,
    tags: [],
    custom_fields: {},
    notes: '',
    ...initialData
  });

  const [showPreview, setShowPreview] = useState(false);

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [showImportWizard, setShowImportWizard] = useState(false);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleFormChange = (field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev};

        delete newErrors[field];
        return newErrors;
      });

    } ;

  const handleCustomFieldChange = (fieldId: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [fieldId]: value
      } ));};

  const handleSave = async () => {
    try {
      // Validate required fields
      const errors: Record<string, string> = {} as any;
      
      if (!formData.name.trim()) {
        errors.name = 'Nome é obrigatório';
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email inválido';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);

        return;
      }

      const result = await createLead(formData);

      if (result) {
        // Redirect to lead detail page
        window.location.href = `/leads/${result.id}`;
      } catch (err) {
      console.error('Error creating lead:', err);

    } ;

  const handleSaveDraft = async () => {
    try {
      const result = await createLead({
        ...formData,
        status: 'draft'
      });

      if (result) {
        // Redirect to leads list
        window.location.href = '/leads';
      } catch (err) {
      console.error('Error saving draft:', err);

    } ;

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
      window.history.back();

    } ;

  const handleBack = () => {
    window.history.back();};

  const handleTemplateSelect = (template: Record<string, any>) => {
    setFormData(prev => ({
      ...prev,
      ...template.data
    }));

    setShowTemplateSelector(false);};

  // ========================================
  // RENDER
  // ========================================
  
  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className} `}>
           
        </div><Head title="Criar Lead - xWin Dash">
          {/* Header */}
        <LeadsHeader
          title="Criar Novo Lead"
          subtitle="Preencha as informações do lead"
          breadcrumbs={[
            { name: 'Leads', href: '/leads' },
            { name: 'Criar Lead', href: '/leads/create', current: true }
          ]}
          actions={[
            {
              label: 'Voltar',
              icon: ArrowLeft,
              onClick: handleBack,
              variant: 'secondary'
            },
            {
              label: 'Salvar Rascunho',
              onClick: handleSaveDraft,
              variant: 'secondary'
            },
            {
              label: 'Salvar',
              icon: Save,
              onClick: handleSave,
              variant: 'primary',
              loading: loading
            }
          ]}
  >
          {/* Main Content */}
        <div className=" ">$2</div><ResponsiveGrid columns={ default: 1, lg: 2 } gap={ 6 } />
            {/* Form Column */}
            <div className="{/* Quick Actions */}">$2</div>
              <Card className="p-6" />
                <div className=" ">$2</div><Button
                    onClick={ () => setShowTemplateSelector(true) }
                    variant="secondary"
                    size="sm"
                  >
                    Usar Template
                  </Button>
                  <Button
                    onClick={ () => setShowImportWizard(true) }
                    variant="secondary"
                    size="sm"
                  >
                    Importar CSV
                  </Button>
                  <Button
                    onClick={ () => setShowPreview(!showPreview) }
                    variant="secondary"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Ocultar' : 'Mostrar'} Eye
                  </Button></div></Card>

              {/* Lead Form */}
              <Card className="p-6" />
                <LeadForm
                  data={ formData }
                  onChange={ handleFormChange }
                  errors={ validationErrors }
                  loading={ loading }
                / />
              </Card>

              {/* Custom Fields */}
              {customFields.length > 0 && (
                <Card className="p-6" />
                  <LeadsMetrics
                    fields={ customFields }
                    values={ formData.custom_fields }
                    onChange={ handleCustomFieldChange }
                    loading={ loading }
                  / />
                </Card>
              )}
            </div>

            {/* Eye Column */}
            {showPreview && (
              <div className=" ">$2</div><Card className="p-6" />
                  <div className=" ">$2</div><h3 className="text-lg font-semibold">Eye</h3>
                    <Button
                      onClick={ () => setShowPreview(false) }
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" /></Button></div>
                  <LeadsHeader
                    data={ formData }
                    loading={ loading }
                  / /></Card></div>
            )}
          </ResponsiveGrid>

          {/* Action Buttons */}
          <div className=" ">$2</div><Button
              onClick={ handleCancel }
              variant="secondary" />
              Cancelar
            </Button>
            <Button
              onClick={ handleSaveDraft }
              variant="secondary"
              loading={ loading } />
              Salvar Rascunho
            </Button>
            <Button
              onClick={ handleSave }
              variant="primary"
              loading={ loading } />
              <Save className="w-4 h-4 mr-2" />
              Criar Lead
            </Button>
          </div>

        {/* Template Selector Modal */}
        { showTemplateSelector && (
          <Suspense fallback={ <LoadingSpinner size="lg" />  }>
            <LeadTemplateSelector
              onSelect={ handleTemplateSelect }
              onClose={ () => setShowTemplateSelector(false) } />
          </Suspense>
        )}

        {/* Import Wizard Modal */}
        { showImportWizard && (
          <Suspense fallback={ <LoadingSpinner size="lg" />  }>
            <LeadImportWizard
              onImport={(data: unknown) => {
                setFormData(prev => ({ ...prev, ...data }));

                setShowImportWizard(false);

              } onClose={ () => setShowImportWizard(false) } />
          </Suspense>
        )}
      </div>
    </PageTransition>);};

export default LeadsCreatePage;
