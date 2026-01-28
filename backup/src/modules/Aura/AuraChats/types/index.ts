/**
 * Exportações centralizadas dos tipos do módulo AuraChats
 */

// Tipos principais
export * from './auraChatsTypes';

// Re-exportações para conveniência
export type {
  ChatStatus,
  MessageStatus,
  MessageDirection,
  MessageType,
  AuraChat,
  AuraMessage,
  AuraContact,
  MessageTemplate,
  QuickReply,
  ChatFilters,
  MessageFilters,
  ChatData,
  ChatLog,
  ChatMetrics,
  ChatAnalytics,
  ChatMonitoring,
  ChatBackup,
  ChatExport,
  ChatImport,
  ChatConfig,
  ChatSession,
  ChatTransfer,
  ChatNote,
  ChatTag,
  MessageAttachment,
  MessageReaction,
  MessageForward,
  MessageReply,
  MessageThread,
  MessageSearch,
  MessageSuggestion,
  SentimentAnalysis,
  MessageClassification
} from './auraChatsTypes';
