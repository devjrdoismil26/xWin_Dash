// ========================================
// LEADS EDIT PAGE - PÁGINA DE EDIÇÃO
// ========================================
// Página para editar leads existentes
// Máximo: 200 linhas

import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Save, Eye, X, History } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { useLeads } from '../hooks/useLeads';
import { LeadForm } from '../LeadsManager/components/LeadForm';
import { LeadDetails } from '../LeadsManager/components/LeadDetails';
import { LeadsHeader } from '../components/LeadsHeader';
import { LeadHistory } from '../LeadsManager/components/LeadActivityTimeline';

// ========================================
// INTERFACES
// ========================================

interface LeadsEditPageProps {
  leadId: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// ========================================
// COMPONENTES LAZY LOADED
// ========================================

const LeadVersionHistory = React.lazy(() => import('../LeadsManager/components/LeadActivityTimeline'));

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export const LeadsEditPage: React.FC<LeadsEditPageProps> = ({ leadId,
  className = ''
   }) => {
  const {
    currentLead,
    loading,
    error,
    customFields,
    getLead,
    updateLead,
    clearError
  } = useLeads();

  // ========================================
  // STATE
  // ========================================
  
  const [formData, setFormData] = useState<Record<string, any>>({});

  const [originalData, setOriginalData] = useState<Record<string, any>>({});

  const [showPreview, setShowPreview] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [hasChanges, setHasChanges] = useState(false);

  // ========================================
  // EFFECTS
  // ========================================
  
  useEffect(() => {
    if (leadId) {
      getLead(parseInt(leadId));

    } , [leadId, getLead]);

  useEffect(() => {
    if (currentLead) {
      setFormData(currentLead);

      setOriginalData(currentLead);

    } , [currentLead]);

  useEffect(() => {
    // Check if form has changes
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

    setHasChanges(hasFormChanges);

  }, [formData, originalData]);

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
      
      if (!formData.name?.trim()) {
        errors.name = 'Nome é obrigatório';
      }
      
      if (!formData.email?.trim()) {
        errors.email = 'Email é obrigatório';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Email inválido';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);

        return;
      }

      const result = await updateLead(parseInt(leadId), formData);

      if (result) {
        setOriginalData(result);

        setHasChanges(false);

        // Show success message
      } catch (err) {
      console.error('Error updating lead:', err);

    } ;

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
        setFormData(originalData);

        setHasChanges(false);

        setValidationErrors({});

      } else {
      window.history.back();

    } ;

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('Tem certeza que deseja sair? Todas as alterações serão perdidas.')) {
        window.history.back();

      } else {
      window.history.back();

    } ;

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja reverter todas as alterações?')) {
      setFormData(originalData);

      setHasChanges(false);

      setValidationErrors({});

    } ;

  // ========================================
  // LOADING STATE
  // ========================================
  
  if (loading && !currentLead) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className=" ">$2</div><div className=" ">$2</div><LoadingSpinner size="lg" / />
            <p className="mt-4 text-gray-600">Carregando lead...</p></div></PageTransition>);

  }

  // ========================================
  // ERROR STATE
  // ========================================
  
  if (error && !currentLead) { return (
        <>
      <PageTransition type="fade" duration={500 } />
      <div className=" ">$2</div><Card className="p-8 text-center max-w-md" />
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Erro ao carregar lead</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className=" ">$2</div><Button onClick={handleBack} variant="secondary" />
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={() => getLead(parseInt(leadId))} variant="primary">
                Tentar Novamente
              </Button></div></Card></div></PageTransition>);

  }

  // ========================================
  // RENDER
  // ========================================
  
  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className} `}>
           
        </div><Head title={`Editar ${currentLead?.name || 'Lead'} - xWin Dash`}>
          {/* Header */}
        <LeadsHeader
          title={`Editar ${currentLead?.name || 'Lead'}`}
          subtitle={ currentLead?.email || 'Carregando...' }
          breadcrumbs={[
            { name: 'Leads', href: '/leads' },
            { name: currentLead?.name || 'Lead', href: `/leads/${leadId}` },
            { name: 'Editar', href: `/leads/${leadId}/edit`, current: true }
          ]}
          actions={[
            {
              label: 'Voltar',
              icon: ArrowLeft,
              onClick: handleBack,
              variant: 'secondary'
            },
            {
              label: 'Histórico',
              icon: History,
              onClick: () => setShowHistory(true),
              variant: 'secondary'
            },
            {
              label: 'Salvar',
              icon: Save,
              onClick: handleSave,
              variant: 'primary',
              loading: loading,
              disabled: !hasChanges
            }
          ]} />

        {/* Main Content */}
        <div className=" ">$2</div><ResponsiveGrid columns={ default: 1, lg: 2 } gap={ 6 } />
            {/* Form Column */}
            <div className="{/* Change Indicator */}">$2</div>
              {hasChanges && (
                <Card className="p-4 bg-yellow-50 border-yellow-200" />
                  <div className=" ">$2</div><p className="text-yellow-800">Você tem alterações não salvas</p>
                    <Button
                      onClick={ handleReset }
                      variant="secondary"
                      size="sm" />
                      Reverter
                    </Button></div></Card>
              )}

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
                  <LeadCustomFields
                    fields={ customFields }
                    values={formData.custom_fields || {} onChange={ handleCustomFieldChange }
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
                  <LeadPreview
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
              onClick={ () => setShowPreview(!showPreview) }
              variant="secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Eye
            </Button>
            <Button
              onClick={ handleSave }
              variant="primary"
              loading={ loading }
              disabled={ !hasChanges } />
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>

        {/* History Modal */}
        { showHistory && (
          <Suspense fallback={ <LoadingSpinner size="lg" />  }>
            <LeadVersionHistory
              leadId={ parseInt(leadId) }
              onClose={ () => setShowHistory(false) } />
          </Suspense>
        )}
      </div>
    </PageTransition>);};

export default LeadsEditPage;
