/**
 * Formatadores do módulo Activity
 * Centraliza funções de formatação de dados
 */

import { ActivityLog } from '../types';
import { getLogType } from './activityHelpers';

/**
 * Formata timestamp para exibição
 */
export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString('pt-BR');};

/**
 * Formata tempo relativo (ex: "há 2 horas")
 */
export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();

  const time = new Date(timestamp);

  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'agora mesmo';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);

    return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);

    return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);

    return `${days} dia${days > 1 ? 's' : ''} atrás`;
  } ;

/**
 * Formata descrição do log
 */
export const formatLogDescription = (log: ActivityLog): string => {
  if (log.description) {
    return log.description;
  }

  // Generate description from log_name and properties
  const type = getLogType(log.log_name);

  const subject = log.subject_type ? log.subject_type.replace('App\\Models\\', '') : 'item';
  
  switch (type) {
    case 'create':
      return `${subject} criado`;
    case 'update':
      return `${subject} atualizado`;
    case 'delete':
      return `${subject} excluído`;
    case 'login':
      return 'Usuário fez login';
    case 'logout':
      return 'Usuário fez logout';
    default:
      return log.log_name.replace(/\./g, ' ');

  } ;

/**
 * Formata número com separadores
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;};

/**
 * Formata duração em milissegundos
 */
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(seconds / 60);

  const hours = Math.floor(minutes / 60);

  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  } ;

/**
 * Formata tamanho de arquivo
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];};

/**
 * Formata propriedades do log para exibição
 */
export const formatLogProperties = (properties: Record<string, any>): string => {
  if (!properties || Object.keys(properties).length === 0) {
    return 'Nenhuma propriedade';
  }
  
  return JSON.stringify(properties, null, 2);};

/**
 * Formata resumo de atividade
 */
export const formatActivitySummary = (stats: Record<string, any>): string => {
  const { total_logs, logs_today, top_actions } = stats;
  
  let summary = `Total de ${formatNumber(total_logs)} atividades registradas. `;
  summary += `Hoje foram ${formatNumber(logs_today)} atividades. `;
  
  if (top_actions && top_actions.length > 0) {
    const topAction = top_actions[0];
    summary += `Ação mais comum: ${topAction.log_name} (${formatNumber(topAction.count)} vezes).`;
  }
  
  return summary;};

/**
 * Formata status de saúde do sistema
 */
export const formatHealthStatus = (percentage: number): { status: string; color: string } => {
  if (percentage >= 95) {
    return { status: 'Excelente', color: 'green'};

  } else if (percentage >= 85) {
    return { status: 'Bom', color: 'blue'};

  } else if (percentage >= 70) {
    return { status: 'Regular', color: 'yellow'};

  } else if (percentage >= 50) {
    return { status: 'Ruim', color: 'orange'};

  } else {
    return { status: 'Crítico', color: 'red'};

  } ;

/**
 * Formata data para filtros
 */
export const formatDateForFilter = (date: Date): string => {
  return date.toISOString().split('T')[0];};

/**
 * Formata período para exibição
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);

  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString('pt-BR');

  const endFormatted = end.toLocaleDateString('pt-BR');

  return `${startFormatted} - ${endFormatted}`;};

/**
 * Formata contador de logs
 */
export const formatLogCount = (count: number): string => {
  if (count === 0) return 'Nenhum log';
  if (count === 1) return '1 log';
  return `${formatNumber(count)} logs`;};

/**
 * Formata tempo de resposta
 */
export const formatResponseTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  } ;
