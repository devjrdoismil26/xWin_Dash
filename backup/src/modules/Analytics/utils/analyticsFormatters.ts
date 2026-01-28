export const formatAnalyticsData = (data: Record<string, unknown>) => {
  return {
    ...data,
    formattedValue: formatNumber(data.value as number),
    formattedDate: formatDate(data.timestamp as string)
  };
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};