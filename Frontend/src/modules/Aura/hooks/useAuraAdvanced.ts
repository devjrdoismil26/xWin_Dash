import { useState, useCallback } from 'react';
import { useAura } from './useAura';

export const useAuraAdvanced = () => {
  const aura = useAura();

  const [loading, setLoading] = useState(false);

  const sendBulkMessages = useCallback(async (messages: string[]) => {
    setLoading(true);

    try {
      const results = await Promise.all(messages.map(msg => aura.sendMessage(msg)));

      return results;
    } finally {
      setLoading(false);

    } , [aura]);

  const scheduleMessage = useCallback(async (message: unknown, scheduledAt: Date) => {
    setLoading(true);

    try {
      return await aura.sendMessage({ ...message, scheduledAt });

    } finally {
      setLoading(false);

    } , [aura]);

  const createTemplate = useCallback(async (template: unknown) => {
    setLoading(true);

    try {
      return await aura.sendMessage({ type: 'template', ...template });

    } finally {
      setLoading(false);

    } , [aura]);

  return {
    ...aura,
    loading,
    sendBulkMessages,
    scheduleMessage,
    createTemplate};
};

export { useAuraAnalytics };

export { useAuraDashboards };
