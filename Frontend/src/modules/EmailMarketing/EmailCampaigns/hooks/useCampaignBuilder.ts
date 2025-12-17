/**
 * Hook para o construtor de campanhas
 * Gerencia o estado e lógica do builder de campanhas
 */

import { useState, useCallback } from 'react';
import { CampaignBuilder, CampaignBuilderData, CampaignBuilderErrors, UseCampaignBuilderReturn } from '../types';

export const useCampaignBuilder = (): UseCampaignBuilderReturn => {
  // Estado do builder
  const [builder, setBuilder] = useState<CampaignBuilder>({
    step: 'details',
    data: {
      details: {
        name: '',
        subject: '',
        preview_text: '',
        type: 'regular'
      },
      content: {
        template_id: '',
        html: '',
        text: '',
        images: []
      },
      recipients: {
        segment_id: '',
        list_id: '',
        custom_recipients: []
      },
      schedule: {
        send_immediately: true,
        scheduled_at: '',
        timezone: 'America/Sao_Paulo'
      },
      settings: {
        from_name: '',
        from_email: '',
        reply_to: '',
        track_opens: true,
        track_clicks: true
      } ,
    errors: {
      details: {},
      content: {},
      recipients: {},
      schedule: {},
      settings: {} });

  // Função para atualizar o step atual
  const updateStep = useCallback((step: CampaignBuilder['step']) => {
    setBuilder(prev => ({
      ...prev,
      step
    }));

  }, []);

  // Função para atualizar dados de um step específico
  const updateData = useCallback((step: keyof CampaignBuilderData, data: Record<string, any>) => {
    setBuilder(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [step]: {
          ...prev.data[step],
          ...data
        } ,
      is_dirty: true
    }));

  }, []);

  // Função para validar um step específico
  const validateStep = useCallback((step: keyof CampaignBuilderData): boolean => {
    const stepData = builder.data[step];
    const errors: Record<string, string> = {};

    switch (step) {
      case 'details':
        if (!stepData.name || stepData.name.trim().length === 0) {
          errors.name = 'Nome da campanha é obrigatório';
        }
        if (!stepData.subject || stepData.subject.trim().length === 0) {
          errors.subject = 'Assunto é obrigatório';
        }
        break;

      case 'content':
        if (!stepData.template_id && (!stepData.html || stepData.html.trim().length === 0)) {
          errors.content = 'Template ou conteúdo HTML é obrigatório';
        }
        break;

      case 'recipients':
        if (!stepData.segment_id && !stepData.list_id && stepData.custom_recipients.length === 0) {
          errors.recipients = 'Pelo menos um destinatário deve ser selecionado';
        }
        break;

      case 'schedule':
        if (!stepData.send_immediately && (!stepData.scheduled_at || stepData.scheduled_at.trim().length === 0)) {
          errors.schedule = 'Data de agendamento é obrigatória quando não enviar imediatamente';
        }
        break;

      case 'settings':
        if (!stepData.from_name || stepData.from_name.trim().length === 0) {
          errors.from_name = 'Nome do remetente é obrigatório';
        }
        if (!stepData.from_email || stepData.from_email.trim().length === 0) {
          errors.from_email = 'Email do remetente é obrigatório';
        }
        break;
    }

    // Atualizar erros
    setBuilder(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [step]: errors
      } ));

    return Object.keys(errors).length === 0;
  }, [builder.data]);

  // Função para validar todos os steps
  const validateAll = useCallback((): boolean => {
    const steps: (keyof CampaignBuilderData)[] = ['details', 'content', 'recipients', 'schedule', 'settings'];
    let isValid = true;

    steps.forEach(step => {
      if (!validateStep(step)) {
        isValid = false;
      } );

    return isValid;
  }, [validateStep]);

  // Função para salvar rascunho
  const saveDraft = useCallback(async () => {
    try {
      // Implementar lógica de salvamento de rascunho
      return Promise.resolve();

    } catch (error) {
      console.error('Error saving draft:', error);

      throw error;
    } , [builder.data]);

  // Função para criar campanha
  const createCampaign = useCallback(async () => {
    if (!validateAll()) {
      throw new Error('Dados inválidos. Verifique os erros nos formulários.');

    }

    try {
      // Implementar lógica de criação de campanha
      const campaignData = {
        ...builder.data.details,
        content: builder.data.content,
        recipients: builder.data.recipients,
        schedule: builder.data.schedule,
        settings: builder.data.settings};

      // Simular chamada de API
      return Promise.resolve({
        success: true,
        data: { id: 'new-campaign-id', ...campaignData } );

    } catch (error) {
      console.error('Error creating campaign:', error);

      throw error;
    } , [builder.data, validateAll]);

  // Função para resetar o builder
  const resetBuilder = useCallback(() => {
    setBuilder({
      step: 'details',
      data: {
        details: {
          name: '',
          subject: '',
          preview_text: '',
          type: 'regular'
        },
        content: {
          template_id: '',
          html: '',
          text: '',
          images: []
        },
        recipients: {
          segment_id: '',
          list_id: '',
          custom_recipients: []
        },
        schedule: {
          send_immediately: true,
          scheduled_at: '',
          timezone: 'America/Sao_Paulo'
        },
        settings: {
          from_name: '',
          from_email: '',
          reply_to: '',
          track_opens: true,
          track_clicks: true
        } ,
      errors: {
        details: {},
        content: {},
        recipients: {},
        schedule: {},
        settings: {} });

  }, []);

  // Função para obter progresso do step
  const getStepProgress = useCallback((): number => {
    const steps = ['details', 'content', 'recipients', 'schedule', 'settings'];
    const currentStepIndex = steps.indexOf(builder.step);

    return ((currentStepIndex + 1) / steps.length) * 100;
  }, [builder.step]);

  // Função para verificar se pode prosseguir para o próximo step
  const canProceedToNext = useCallback((): boolean => {
    return validateStep(builder.step);

  }, [builder.step, validateStep]);

  return {
    builder,
    updateStep,
    updateData,
    validateStep,
    validateAll,
    saveDraft,
    createCampaign,
    resetBuilder,
    getStepProgress,
    canProceedToNext};
};
