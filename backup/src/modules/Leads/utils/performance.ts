// ========================================
// OTIMIZAÇÕES DE PERFORMANCE - LEADS
// ========================================

import { Lead, LeadFilters, LeadMetrics, LeadAnalytics } from '../types';

// Debounce utility for search and filters
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll and resize events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Virtual scrolling utilities
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
}

export const calculateVirtualScroll = (
  scrollTop: number,
  itemCount: number,
  config: VirtualScrollConfig
): VirtualScrollResult => {
  const { itemHeight, containerHeight, overscan = 5 } = config;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;
  
  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY
  };
};

// Lead filtering and sorting optimizations
export const filterLeads = memoize(
  (leads: Lead[], filters: LeadFilters): Lead[] => {
    return leads.filter(lead => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company?.toLowerCase().includes(searchLower) ||
          lead.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(lead.status)) return false;
      }

      // Origin filter
      if (filters.origin && filters.origin.length > 0) {
        if (!filters.origin.includes(lead.origin)) return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const leadTags = lead.tags.map(tag => tag.name);
        const hasMatchingTag = filters.tags.some(tag => leadTags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Score range filter
      if (filters.score_range) {
        if (lead.score < filters.score_range.min || lead.score > filters.score_range.max) {
          return false;
        }
      }

      // Assigned users filter
      if (filters.assigned_to && filters.assigned_to.length > 0) {
        if (!lead.assigned_to || !filters.assigned_to.includes(lead.assigned_to.id)) {
          return false;
        }
      }

      // Date range filter
      if (filters.date_range) {
        const leadDate = new Date(lead[filters.date_range.field]);
        const startDate = new Date(filters.date_range.start);
        const endDate = new Date(filters.date_range.end);
        
        if (leadDate < startDate || leadDate > endDate) {
          return false;
        }
      }

      return true;
    });
  },
  (leads, filters) => `${leads.length}-${JSON.stringify(filters)}`
);

export const sortLeads = memoize(
  (leads: Lead[], sortBy: keyof Lead, sortOrder: 'asc' | 'desc'): Lead[] => {
    return [...leads].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  },
  (leads, sortBy, sortOrder) => `${leads.length}-${sortBy}-${sortOrder}`
);

// Lead statistics calculations
export const calculateLeadStats = memoize(
  (leads: Lead[]) => {
    const stats = {
      total: leads.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
      lost: 0,
      averageScore: 0,
      totalValue: 0,
      conversionRate: 0
    };

    if (leads.length === 0) return stats;

    let totalScore = 0;
    let totalValue = 0;

    leads.forEach(lead => {
      switch (lead.status) {
        case 'new':
          stats.new++;
          break;
        case 'contacted':
          stats.contacted++;
          break;
        case 'qualified':
          stats.qualified++;
          break;
        case 'converted':
          stats.converted++;
          break;
        case 'lost':
          stats.lost++;
          break;
      }

      totalScore += lead.score || 0;
      totalValue += lead.lifetime_value || 0;
    });

    stats.averageScore = totalScore / leads.length;
    stats.totalValue = totalValue;
    stats.conversionRate = stats.total > 0 ? (stats.converted / stats.total) * 100 : 0;

    return stats;
  },
  (leads) => `${leads.length}-${leads.map(l => `${l.id}-${l.status}-${l.score}`).join(',')}`
);

// Lead grouping utilities
export const groupLeadsByStatus = memoize(
  (leads: Lead[]) => {
    const groups: Record<string, Lead[]> = {};
    
    leads.forEach(lead => {
      if (!groups[lead.status]) {
        groups[lead.status] = [];
      }
      groups[lead.status].push(lead);
    });

    return groups;
  },
  (leads) => `${leads.length}-${leads.map(l => l.status).join(',')}`
);

export const groupLeadsByOrigin = memoize(
  (leads: Lead[]) => {
    const groups: Record<string, Lead[]> = {};
    
    leads.forEach(lead => {
      if (!groups[lead.origin]) {
        groups[lead.origin] = [];
      }
      groups[lead.origin].push(lead);
    });

    return groups;
  },
  (leads) => `${leads.length}-${leads.map(l => l.origin).join(',')}`
);

export const groupLeadsByScore = memoize(
  (leads: Lead[]) => {
    const groups = {
      '0-20': [] as Lead[],
      '21-40': [] as Lead[],
      '41-60': [] as Lead[],
      '61-80': [] as Lead[],
      '81-100': [] as Lead[]
    };
    
    leads.forEach(lead => {
      const score = lead.score || 0;
      if (score <= 20) groups['0-20'].push(lead);
      else if (score <= 40) groups['21-40'].push(lead);
      else if (score <= 60) groups['41-60'].push(lead);
      else if (score <= 80) groups['61-80'].push(lead);
      else groups['81-100'].push(lead);
    });

    return groups;
  },
  (leads) => `${leads.length}-${leads.map(l => l.score).join(',')}`
);

// Lead search utilities
export const searchLeads = memoize(
  (leads: Lead[], query: string): Lead[] => {
    if (!query.trim()) return leads;

    const searchLower = query.toLowerCase();
    
    return leads.filter(lead => {
      return (
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.company?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(query) ||
        lead.whatsapp?.includes(query) ||
        lead.notes?.toLowerCase().includes(searchLower) ||
        lead.tags.some(tag => tag.name.toLowerCase().includes(searchLower))
      );
    });
  },
  (leads, query) => `${leads.length}-${query.toLowerCase()}`
);

// Lead export utilities
export const prepareLeadsForExport = memoize(
  (leads: Lead[], fields: string[] = []): any[] => {
    const defaultFields = [
      'id', 'name', 'email', 'phone', 'whatsapp', 'company', 'position',
      'status', 'score', 'origin', 'notes', 'created_at', 'updated_at'
    ];
    
    const exportFields = fields.length > 0 ? fields : defaultFields;
    
    return leads.map(lead => {
      const exportLead: any = {};
      
      exportFields.forEach(field => {
        switch (field) {
          case 'assigned_to':
            exportLead[field] = lead.assigned_to?.name || '';
            break;
          case 'tags':
            exportLead[field] = lead.tags.map(tag => tag.name).join(', ');
            break;
          case 'custom_fields':
            exportLead[field] = JSON.stringify(lead.custom_fields);
            break;
          default:
            exportLead[field] = (lead as any)[field] || '';
        }
      });
      
      return exportLead;
    });
  },
  (leads, fields) => `${leads.length}-${fields.join(',')}`
);

// Lead import utilities
export const validateLeadData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim() === '') {
    errors.push('Nome é obrigatório');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('Email é obrigatório');
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push('Email inválido');
  }
  
  if (data.score !== undefined && (data.score < 0 || data.score > 100)) {
    errors.push('Score deve estar entre 0 e 100');
  }
  
  if (data.phone && !/^\+?[\d\s\-()]+$/.test(data.phone)) {
    errors.push('Formato de telefone inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const normalizeLeadData = (data: any): Partial<Lead> => {
  return {
    name: data.name?.trim() || '',
    email: data.email?.trim().toLowerCase() || '',
    phone: data.phone?.trim() || undefined,
    whatsapp: data.whatsapp?.trim() || undefined,
    company: data.company?.trim() || undefined,
    position: data.position?.trim() || undefined,
    status: data.status || 'new',
    score: parseInt(data.score) || 0,
    origin: data.origin || 'import',
    notes: data.notes?.trim() || undefined,
    tags: data.tags ? data.tags.split(',').map((tag: string) => ({ id: 0, name: tag.trim() })) : [],
    custom_fields: data.custom_fields ? JSON.parse(data.custom_fields) : {}
  };
};

// Performance monitoring utilities
export const performanceMonitor = {
  start: (label: string) => {
    performance.mark(`${label}-start`);
  },
  
  end: (label: string) => {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
    
    return measure.duration;
  },
  
  measure: <T>(label: string, fn: () => T): T => {
    performanceMonitor.start(label);
    const result = fn();
    performanceMonitor.end(label);
    return result;
  },
  
  measureAsync: async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    performanceMonitor.start(label);
    const result = await fn();
    performanceMonitor.end(label);
    return result;
  }
};

// Memory management utilities
export const memoryManager = {
  clearCache: () => {
    // Clear memoization caches
    // This would need to be implemented based on the memoization library used
    console.log('Cache cleared');
  },
  
  getMemoryUsage: () => {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  },
  
  logMemoryUsage: () => {
    const memory = memoryManager.getMemoryUsage();
    if (memory) {
      console.log('Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
    }
  }
};

// Batch processing utilities
export const batchProcessor = {
  process: async <T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize: number = 10,
    delay: number = 0
  ): Promise<R[]> => {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processor));
      results.push(...batchResults);
      
      if (delay > 0 && i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return results;
  }
};

export default {
  debounce,
  throttle,
  memoize,
  calculateVirtualScroll,
  filterLeads,
  sortLeads,
  calculateLeadStats,
  groupLeadsByStatus,
  groupLeadsByOrigin,
  groupLeadsByScore,
  searchLeads,
  prepareLeadsForExport,
  validateLeadData,
  normalizeLeadData,
  performanceMonitor,
  memoryManager,
  batchProcessor
};
