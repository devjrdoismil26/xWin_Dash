/**
 * Hook para o construtor de segmentos
 * Gerencia o estado e lógica do builder de segmentos
 */

import { useState, useCallback } from 'react';
import { 
  SegmentBuilder, 
  SegmentCriteria, 
  SegmentGroup,
  SegmentValidationError,
  UseSegmentBuilderReturn 
} from '../types';

export const useSegmentBuilder = (initialSegment?: any): UseSegmentBuilderReturn => {
  // Estado do builder
  const [builder, setBuilder] = useState<SegmentBuilder>({
    segment: initialSegment || {
      id: '',
      name: '',
      description: '',
      criteria: [],
      subscriber_count: 0,
      is_active: true,
      is_dynamic: true,
      created_at: '',
      updated_at: '',
      created_by: '',
      tags: [],
      color: '#3B82F6',
      icon: 'users',
      last_calculated_at: '',
      calculation_status: 'pending'
    },
    criteria: [],
    groups: [],
    available_fields: [],
    is_preview_mode: false,
    preview_count: 0,
    preview_subscribers: [],
    validation_errors: []
  });

  // Função para atualizar o segmento
  const updateSegment = useCallback((updates: any) => {
    setBuilder(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        ...updates
      }
    }));
  }, []);

  // Função para adicionar critério
  const addCriteria = useCallback((criteria: SegmentCriteria) => {
    setBuilder(prev => ({
      ...prev,
      criteria: [...prev.criteria, criteria]
    }));
  }, []);

  // Função para atualizar critério
  const updateCriteria = useCallback((id: string, updates: Partial<SegmentCriteria>) => {
    setBuilder(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  }, []);

  // Função para remover critério
  const removeCriteria = useCallback((id: string) => {
    setBuilder(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== id)
    }));
  }, []);

  // Função para adicionar grupo
  const addGroup = useCallback((group: SegmentGroup) => {
    setBuilder(prev => ({
      ...prev,
      groups: [...prev.groups, group]
    }));
  }, []);

  // Função para atualizar grupo
  const updateGroup = useCallback((id: string, updates: Partial<SegmentGroup>) => {
    setBuilder(prev => ({
      ...prev,
      groups: prev.groups.map(g => 
        g.id === id ? { ...g, ...updates } : g
      )
    }));
  }, []);

  // Função para remover grupo
  const removeGroup = useCallback((id: string) => {
    setBuilder(prev => ({
      ...prev,
      groups: prev.groups.filter(g => g.id !== id)
    }));
  }, []);

  // Função para preview do segmento
  const previewSegment = useCallback(async () => {
    try {
      // Simular chamada de API para preview
      const mockPreview = {
        count: Math.floor(Math.random() * 1000) + 100,
        subscribers: [
          {
            id: '1',
            email: 'user1@example.com',
            first_name: 'João',
            last_name: 'Silva',
            custom_fields: { age: 25, city: 'São Paulo' },
            match_reason: 'Age equals 25'
          },
          {
            id: '2',
            email: 'user2@example.com',
            first_name: 'Maria',
            last_name: 'Santos',
            custom_fields: { age: 30, city: 'Rio de Janeiro' },
            match_reason: 'City contains Rio'
          }
        ]
      };

      setBuilder(prev => ({
        ...prev,
        preview_count: mockPreview.count,
        preview_subscribers: mockPreview.subscribers
      }));

      return Promise.resolve({
        success: true,
        data: mockPreview
      });
    } catch (error) {
      console.error('Error previewing segment:', error);
      throw error;
    }
  }, []);

  // Função para validar segmento
  const validateSegment = useCallback((): { isValid: boolean; errors: SegmentValidationError[] } => {
    const errors: SegmentValidationError[] = [];

    // Validar nome
    if (!builder.segment.name || builder.segment.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Nome do segmento é obrigatório',
        type: 'error'
      });
    }

    // Validar critérios
    if (builder.criteria.length === 0) {
      errors.push({
        field: 'criteria',
        message: 'Pelo menos um critério deve ser definido',
        type: 'error'
      });
    }

    // Validar cada critério
    builder.criteria.forEach((criteria, index) => {
      if (!criteria.field || criteria.field.trim().length === 0) {
        errors.push({
          field: `criteria_${index}_field`,
          message: `Critério ${index + 1}: campo é obrigatório`,
          type: 'error'
        });
      }

      if (!criteria.operator) {
        errors.push({
          field: `criteria_${index}_operator`,
          message: `Critério ${index + 1}: operador é obrigatório`,
          type: 'error'
        });
      }

      if (criteria.value === undefined || criteria.value === null || criteria.value === '') {
        errors.push({
          field: `criteria_${index}_value`,
          message: `Critério ${index + 1}: valor é obrigatório`,
          type: 'error'
        });
      }
    });

    setBuilder(prev => ({
      ...prev,
      validation_errors: errors
    }));

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [builder.segment.name, builder.criteria]);

  // Função para salvar segmento
  const saveSegment = useCallback(async () => {
    const validation = validateSegment();
    
    if (!validation.isValid) {
      throw new Error('Segmento inválido. Verifique os erros.');
    }

    try {
      const segmentData = {
        ...builder.segment,
        criteria: builder.criteria
      };

      console.log('Saving segment:', segmentData);
      
      // Simular chamada de API
      return Promise.resolve({
        success: true,
        data: { id: 'new-segment-id', ...segmentData }
      });
    } catch (error) {
      console.error('Error saving segment:', error);
      throw error;
    }
  }, [builder.segment, builder.criteria, validateSegment]);

  // Função para resetar builder
  const resetBuilder = useCallback(() => {
    setBuilder({
      segment: {
        id: '',
        name: '',
        description: '',
        criteria: [],
        subscriber_count: 0,
        is_active: true,
        is_dynamic: true,
        created_at: '',
        updated_at: '',
        created_by: '',
        tags: [],
        color: '#3B82F6',
        icon: 'users',
        last_calculated_at: '',
        calculation_status: 'pending'
      },
      criteria: [],
      groups: [],
      available_fields: [],
      is_preview_mode: false,
      preview_count: 0,
      preview_subscribers: [],
      validation_errors: []
    });
  }, []);

  // Função para obter complexidade do segmento
  const getSegmentComplexity = useCallback((): 'simple' | 'medium' | 'complex' => {
    const criteriaCount = builder.criteria.length;
    const groupsCount = builder.groups.length;

    if (criteriaCount <= 2 && groupsCount === 0) {
      return 'simple';
    } else if (criteriaCount <= 5 && groupsCount <= 2) {
      return 'medium';
    } else {
      return 'complex';
    }
  }, [builder.criteria.length, builder.groups.length]);

  // Função para verificar se pode calcular segmento
  const canCalculateSegment = useCallback((): boolean => {
    return builder.criteria.length > 0 && 
           builder.segment.name.trim().length > 0 &&
           builder.validation_errors.length === 0;
  }, [builder.criteria.length, builder.segment.name, builder.validation_errors.length]);

  return {
    builder,
    updateSegment,
    addCriteria,
    updateCriteria,
    removeCriteria,
    addGroup,
    updateGroup,
    removeGroup,
    previewSegment,
    validateSegment,
    saveSegment,
    resetBuilder,
    getSegmentComplexity,
    canCalculateSegment
  };
};
