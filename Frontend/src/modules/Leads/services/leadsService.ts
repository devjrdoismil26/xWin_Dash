// ========================================
// LEADS SERVICE - ORQUESTRADOR PRINCIPAL
// ========================================

import { ApiResponse } from '@/types/common';
import { leadsCoreService } from '../LeadsCore/services/leadsCoreService';

// Aliases para compatibilidade
export const fetchLeads = leadsCoreService.getLeads;
export const fetchLeadById = leadsCoreService.getLead;
export const createLead = leadsCoreService.createLead;
export const updateLead = leadsCoreService.updateLead;
export const deleteLead = leadsCoreService.deleteLead;

// Serviço principal
export const leadsService = {
  ...leadsCoreService,
  
  // Métodos adicionais podem ser adicionados aqui
  async getLeadStats() {
    return { total: 0, active: 0, converted: 0};

  } ;
