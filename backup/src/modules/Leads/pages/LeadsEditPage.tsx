// ========================================
// LEADS EDIT PAGE - PÁGINA DE EDIÇÃO
// ========================================
// Página para editar leads existentes
// Máximo: 200 linhas

import React, { Suspense, useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Save, Eye, X, History } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
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
}

// ========================================
// COMPONENTES LAZY LOADED
// ========================================

const LeadVersionHistory = React.lazy(() => import('../LeadsManager/components/LeadActivityTimeline'));

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export const LeadsEditPage: React.FC<LeadsEditPageProps> = ({ 
  leadId,
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
  
  const [formData, setFormData] = useState<any>({});
  const [originalData, setOriginalData] = useState<any>({});
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
    }
  }, [leadId, getLead]);

  useEffect(() => {
    if (currentLead) {
      setFormData(currentLead);
      setOriginalData(currentLead);
    }
  }, [currentLead]);

  useEffect(() => {
    // Check if form has changes
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(hasFormChanges);
  }, [formData, originalData]);

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      custom_fields: {
        ...prev.custom_fields,
        [fieldId]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      const errors: Record<string, string> = {};
      
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
        console.log('Lead updated successfully');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Tem certeza que deseja cancelar? Todas as alterações serão perdidas.')) {
        setFormData(originalData);
        setHasChanges(false);
        setValidationErrors({});
      }
    } else {
      window.history.back();
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm('Tem certeza que deseja sair? Todas as alterações serão perdidas.')) {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja reverter todas as alterações?')) {
      setFormData(originalData);
      setHasChanges(false);
      setValidationErrors({});
    }
  };

  // ========================================
  // LOADING STATE
  // ========================================
  
  if (loading && !currentLead) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Carregando lead...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  
  if (error && !currentLead) {
    return (
      <PageTransition type="fade" duration={500}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Erro ao carregar lead</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleBack} variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={() => getLead(parseInt(leadId))} variant="primary">
                Tentar Novamente
              </Button>
            </div>
          </Card>
        </div>
      </PageTransition>
    );
  }

  // ========================================
  // RENDER
  // ========================================
  
  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className}`}>
        <Head title={`Editar ${currentLead?.name || 'Lead'} - xWin Dash`} />
        
        {/* Header */}
        <LeadsHeader
          title={`Editar ${currentLead?.name || 'Lead'}`}
          subtitle={currentLead?.email || 'Carregando...'}
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
          ]}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <ResponsiveGrid columns={{ default: 1, lg: 2 }} gap={6}>
            
            {/* Form Column */}
            <div className="space-y-6">
              
              {/* Change Indicator */}
              {hasChanges && (
                <Card className="p-4 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center justify-between">
                    <p className="text-yellow-800">Você tem alterações não salvas</p>
                    <Button
                      onClick={handleReset}
                      variant="secondary"
                      size="sm"
                    >
                      Reverter
                    </Button>
                  </div>
                </Card>
              )}

              {/* Lead Form */}
              <Card className="p-6">
                <LeadForm
                  data={formData}
                  onChange={handleFormChange}
                  errors={validationErrors}
                  loading={loading}
                />
              </Card>

              {/* Custom Fields */}
              {customFields.length > 0 && (
                <Card className="p-6">
                  <LeadCustomFields
                    fields={customFields}
                    values={formData.custom_fields || {}}
                    onChange={handleCustomFieldChange}
                    loading={loading}
                  />
                </Card>
              )}
            </div>

            {/* Preview Column */}
            {showPreview && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <Button
                      onClick={() => setShowPreview(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <LeadPreview
                    data={formData}
                    loading={loading}
                  />
                </Card>
              </div>
            )}
          </ResponsiveGrid>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button
              onClick={handleCancel}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Ocultar' : 'Mostrar'} Preview
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              loading={loading}
              disabled={!hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* History Modal */}
        {showHistory && (
          <Suspense fallback={<LoadingSpinner size="lg" />}>
            <LeadVersionHistory
              leadId={parseInt(leadId)}
              onClose={() => setShowHistory(false)}
            />
          </Suspense>
        )}
      </div>
    </PageTransition>
  );
};

export default LeadsEditPage;
