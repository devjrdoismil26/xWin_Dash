// ========================================
// PRODUCTS MODULE - A/B TESTING HOOK
// ========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
  ABTest, 
  ABTestVariant, 
  ABTestMetrics, 
  ABTestResults, 
  ABTestType, 
  ABTestStatus,
  CreateABTestData,
  UpdateABTestData
} from '../types/products';

interface UseABTestingOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseABTestingReturn {
  // Data
  tests: ABTest[];
  loading: boolean;
  error: string | null;
  
  // CRUD Operations
  createTest: (data: CreateABTestData) => Promise<ABTest>;
  updateTest: (id: string, data: UpdateABTestData) => Promise<ABTest>;
  deleteTest: (id: string) => Promise<void>;
  duplicateTest: (id: string) => Promise<ABTest>;
  
  // Test Management
  startTest: (id: string) => Promise<ABTest>;
  pauseTest: (id: string) => Promise<ABTest>;
  resumeTest: (id: string) => Promise<ABTest>;
  stopTest: (id: string) => Promise<ABTest>;
  archiveTest: (id: string) => Promise<ABTest>;
  
  // Variant Management
  addVariant: (testId: string, variant: ABTestVariant) => Promise<ABTest>;
  updateVariant: (testId: string, variantId: string, variant: ABTestVariant) => Promise<ABTest>;
  removeVariant: (testId: string, variantId: string) => Promise<ABTest>;
  reorderVariants: (testId: string, variantIds: string[]) => Promise<ABTest>;
  
  // Results & Analytics
  getResults: (id: string) => Promise<ABTestResults>;
  getDetailedResults: (id: string) => Promise<any>;
  getConversionData: (id: string) => Promise<any>;
  getStatisticalSignificance: (id: string) => Promise<number>;
  getWinner: (id: string) => Promise<string | null>;
  
  // Utilities
  refresh: () => Promise<void>;
  getTest: (id: string) => ABTest | undefined;
  getTestsByStatus: (status: ABTestStatus) => ABTest[];
  getTestsByType: (type: ABTestType) => ABTest[];
  getActiveTests: () => ABTest[];
  getCompletedTests: () => ABTest[];
  getDraftTests: () => ABTest[];
  
  // Test Creation Helpers
  createLandingPageTest: (pageId: string, variants: ABTestVariant[]) => Promise<ABTest>;
  createFormTest: (formId: string, variants: ABTestVariant[]) => Promise<ABTest>;
  createCTATest: (elementId: string, variants: ABTestVariant[]) => Promise<ABTest>;
  createHeadlineTest: (elementId: string, variants: ABTestVariant[]) => Promise<ABTest>;
  
  // Statistical Analysis
  calculateSampleSize: (baselineRate: number, minimumDetectableEffect: number, power: number, alpha: number) => number;
  calculateStatisticalPower: (baselineRate: number, variantRate: number, sampleSize: number, alpha: number) => number;
  calculateConfidenceInterval: (conversionRate: number, sampleSize: number, confidence: number) => [number, number];
  isStatisticallySignificant: (controlRate: number, variantRate: number, controlSample: number, variantSample: number, alpha: number) => boolean;
  
  // Recommendations
  getRecommendations: (id: string) => Promise<any>;
  getOptimizationSuggestions: (id: string) => Promise<any>;
  getNextTestIdeas: (targetId: string) => Promise<any>;
}

export const useABTesting = (options: UseABTestingOptions = {}): UseABTestingReturn => {
  const { autoRefresh = false, refreshInterval = 30000 } = options;
  
  // Using router directly for API calls
  
  // State
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tests
  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ab-tests');
      const data = await response.json() as ABTest[];
      
      if (data) {
        setTests(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch A/B tests');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchTests();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchTests]);

  // CRUD operations
  const createTest = useCallback(async (data: CreateABTestData): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newTest = await response.json() as ABTest;
      
      if (newTest) {
        setTests(prev => [newTest, ...prev]);
        return newTest;
      }
      
      throw new Error('Failed to create A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTest = useCallback(async (id: string, data: UpdateABTestData): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedTest = await response.json() as ABTest;
      
      if (updatedTest) {
        setTests(prev => prev.map(t => t.id === id ? updatedTest : t));
        return updatedTest;
      }
      
      throw new Error('Failed to update A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const deleteTest = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await fetch(`/api/ab-tests/${id}`, { method: 'DELETE' });
      
      setTests(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateTest = useCallback(async (id: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}/duplicate`, { method: 'POST' });
      const duplicatedTest = await response.json() as ABTest;
      
      if (duplicatedTest) {
        setTests(prev => [duplicatedTest, ...prev]);
        return duplicatedTest;
      }
      
      throw new Error('Failed to duplicate A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Test management
  const startTest = useCallback(async (id: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}/start`, { method: 'POST' });
      const startedTest = await response.json() as ABTest;
      
      if (startedTest) {
        setTests(prev => prev.map(t => t.id === id ? startedTest : t));
        return startedTest;
      }
      
      throw new Error('Failed to start A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pauseTest = useCallback(async (id: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}/pause`, { method: 'POST' });
      const pausedTest = await response.json() as ABTest;
      
      if (pausedTest) {
        setTests(prev => prev.map(t => t.id === id ? pausedTest : t));
        return pausedTest;
      }
      
      throw new Error('Failed to pause A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resumeTest = useCallback(async (id: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}/resume`, { method: 'POST' });
      const resumedTest = await response.json() as ABTest;
      
      if (resumedTest) {
        setTests(prev => prev.map(t => t.id === id ? resumedTest : t));
        return resumedTest;
      }
      
      throw new Error('Failed to resume A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const stopTest = useCallback(async (id: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}/stop`, { method: 'POST' });
      const stoppedTest = await response.json() as ABTest;
      
      if (stoppedTest) {
        setTests(prev => prev.map(t => t.id === id ? stoppedTest : t));
        return stoppedTest;
      }
      
      throw new Error('Failed to stop A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const archiveTest = useCallback(async (id: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${id}/archive`, { method: 'POST' });
      const archivedTest = await response.json() as ABTest;
      
      if (archivedTest) {
        setTests(prev => prev.map(t => t.id === id ? archivedTest : t));
        return archivedTest;
      }
      
      throw new Error('Failed to archive A/B test');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive A/B test');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Variant management
  const addVariant = useCallback(async (testId: string, variant: ABTestVariant): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${testId}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant })
      });
      const updatedTest = await response.json() as ABTest;
      
      if (updatedTest) {
        setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
        return updatedTest;
      }
      
      throw new Error('Failed to add variant');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add variant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVariant = useCallback(async (testId: string, variantId: string, variant: ABTestVariant): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${testId}/variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant })
      });
      const updatedTest = await response.json() as ABTest;
      
      if (updatedTest) {
        setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
        return updatedTest;
      }
      
      throw new Error('Failed to update variant');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update variant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const removeVariant = useCallback(async (testId: string, variantId: string): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await del(`/api/ab-tests/${testId}/variants/${variantId}`);
      
      if (response.data) {
        const updatedTest = response.data as ABTest;
        setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
        return updatedTest;
      }
      
      throw new Error('Failed to remove variant');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove variant');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderVariants = useCallback(async (testId: string, variantIds: string[]): Promise<ABTest> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ab-tests/${testId}/variants/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantIds })
      });
      const updatedTest = await response.json() as ABTest;
      
      if (updatedTest) {
        setTests(prev => prev.map(t => t.id === testId ? updatedTest : t));
        return updatedTest;
      }
      
      throw new Error('Failed to reorder variants');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder variants');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Results & Analytics
  const getResults = useCallback(async (id: string): Promise<ABTestResults> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/results`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch test results');
      throw err;
    }
  }, []);

  const getDetailedResults = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/detailed-results`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch detailed results');
      throw err;
    }
  }, []);

  const getConversionData = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/conversion-data`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversion data');
      throw err;
    }
  }, []);

  const getStatisticalSignificance = useCallback(async (id: string): Promise<number> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/statistical-significance`);
      const data = await response.json();
      return data.significance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistical significance');
      throw err;
    }
  }, []);

  const getWinner = useCallback(async (id: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/winner`);
      const data = await response.json();
      return data.winner;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch winner');
      throw err;
    }
  }, []);

  // Utilities
  const refresh = useCallback(async () => {
    await fetchTests();
  }, [fetchTests]);

  const getTest = useCallback((id: string): ABTest | undefined => {
    return tests.find(t => t.id === id);
  }, [tests]);

  const getTestsByStatus = useCallback((status: ABTestStatus): ABTest[] => {
    return tests.filter(t => t.status === status);
  }, [tests]);

  const getTestsByType = useCallback((type: ABTestType): ABTest[] => {
    return tests.filter(t => t.type === type);
  }, [tests]);

  const getActiveTests = useCallback((): ABTest[] => {
    return tests.filter(t => t.status === ABTestStatus.RUNNING);
  }, [tests]);

  const getCompletedTests = useCallback((): ABTest[] => {
    return tests.filter(t => t.status === ABTestStatus.COMPLETED);
  }, [tests]);

  const getDraftTests = useCallback((): ABTest[] => {
    return tests.filter(t => t.status === ABTestStatus.DRAFT);
  }, [tests]);

  // Test creation helpers
  const createLandingPageTest = useCallback(async (pageId: string, variants: ABTestVariant[]): Promise<ABTest> => {
    const testData: CreateABTestData = {
      name: `Landing Page Test - ${pageId}`,
      description: `A/B test for landing page ${pageId}`,
      type: ABTestType.LANDING_PAGE,
      target: pageId,
      variants,
      metrics: {
        primary: 'conversion',
        secondary: ['click', 'bounce_rate'],
        minimumDetectableEffect: 0.05,
        statisticalSignificance: 0.95
      }
    };
    
    return createTest(testData);
  }, [createTest]);

  const createFormTest = useCallback(async (formId: string, variants: ABTestVariant[]): Promise<ABTest> => {
    const testData: CreateABTestData = {
      name: `Form Test - ${formId}`,
      description: `A/B test for form ${formId}`,
      type: ABTestType.FORM,
      target: formId,
      variants,
      metrics: {
        primary: 'form_submission',
        secondary: ['field_completion', 'time_to_submit'],
        minimumDetectableEffect: 0.1,
        statisticalSignificance: 0.95
      }
    };
    
    return createTest(testData);
  }, [createTest]);

  const createCTATest = useCallback(async (elementId: string, variants: ABTestVariant[]): Promise<ABTest> => {
    const testData: CreateABTestData = {
      name: `CTA Test - ${elementId}`,
      description: `A/B test for CTA element ${elementId}`,
      type: ABTestType.CTA,
      target: elementId,
      variants,
      metrics: {
        primary: 'click',
        secondary: ['conversion', 'hover'],
        minimumDetectableEffect: 0.15,
        statisticalSignificance: 0.95
      }
    };
    
    return createTest(testData);
  }, [createTest]);

  const createHeadlineTest = useCallback(async (elementId: string, variants: ABTestVariant[]): Promise<ABTest> => {
    const testData: CreateABTestData = {
      name: `Headline Test - ${elementId}`,
      description: `A/B test for headline element ${elementId}`,
      type: ABTestType.HEADLINE,
      target: elementId,
      variants,
      metrics: {
        primary: 'engagement',
        secondary: ['time_on_page', 'scroll_depth'],
        minimumDetectableEffect: 0.1,
        statisticalSignificance: 0.95
      }
    };
    
    return createTest(testData);
  }, [createTest]);

  // Statistical analysis
  const calculateSampleSize = useCallback((baselineRate: number, minimumDetectableEffect: number, power: number = 0.8, alpha: number = 0.05): number => {
    const zAlpha = 1.96; // 95% confidence
    const zBeta = 0.84; // 80% power
    const p1 = baselineRate;
    const p2 = baselineRate + minimumDetectableEffect;
    const p = (p1 + p2) / 2;
    
    const numerator = Math.pow(zAlpha * Math.sqrt(2 * p * (1 - p)) + zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2);
    const denominator = Math.pow(p2 - p1, 2);
    
    return Math.ceil(numerator / denominator);
  }, []);

  const calculateStatisticalPower = useCallback((baselineRate: number, variantRate: number, sampleSize: number, alpha: number = 0.05): number => {
    const zAlpha = 1.96; // 95% confidence
    const p1 = baselineRate;
    const p2 = variantRate;
    const p = (p1 + p2) / 2;
    
    const numerator = Math.abs(p2 - p1) * Math.sqrt(sampleSize) - zAlpha * Math.sqrt(2 * p * (1 - p));
    const denominator = Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
    
    const zBeta = numerator / denominator;
    return Math.max(0, Math.min(1, 1 - 0.5 * (1 + Math.sign(zBeta) * Math.sqrt(1 - Math.exp(-2 * zBeta * zBeta / Math.PI)))));
  }, []);

  const calculateConfidenceInterval = useCallback((conversionRate: number, sampleSize: number, confidence: number = 0.95): [number, number] => {
    const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.58 : 1.645;
    const margin = z * Math.sqrt((conversionRate * (1 - conversionRate)) / sampleSize);
    
    return [
      Math.max(0, conversionRate - margin),
      Math.min(1, conversionRate + margin)
    ];
  }, []);

  const isStatisticallySignificant = useCallback((controlRate: number, variantRate: number, controlSample: number, variantSample: number, alpha: number = 0.05): boolean => {
    const p1 = controlRate;
    const p2 = variantRate;
    const n1 = controlSample;
    const n2 = variantSample;
    
    const p = (p1 * n1 + p2 * n2) / (n1 + n2);
    const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
    const z = Math.abs(p2 - p1) / se;
    
    const criticalValue = alpha === 0.05 ? 1.96 : alpha === 0.01 ? 2.58 : 1.645;
    
    return z > criticalValue;
  }, []);

  // Recommendations
  const getRecommendations = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/recommendations`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
      throw err;
    }
  }, []);

  const getOptimizationSuggestions = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/ab-tests/${id}/optimization-suggestions`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch optimization suggestions');
      throw err;
    }
  }, []);

  const getNextTestIdeas = useCallback(async (targetId: string): Promise<any> => {
    try {
      const response = await fetch(`/api/ab-tests/next-test-ideas?targetId=${targetId}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch next test ideas');
      throw err;
    }
  }, []);

  return {
    // Data
    tests,
    loading,
    error,
    
    // CRUD Operations
    createTest,
    updateTest,
    deleteTest,
    duplicateTest,
    
    // Test Management
    startTest,
    pauseTest,
    resumeTest,
    stopTest,
    archiveTest,
    
    // Variant Management
    addVariant,
    updateVariant,
    removeVariant,
    reorderVariants,
    
    // Results & Analytics
    getResults,
    getDetailedResults,
    getConversionData,
    getStatisticalSignificance,
    getWinner,
    
    // Utilities
    refresh,
    getTest,
    getTestsByStatus,
    getTestsByType,
    getActiveTests,
    getCompletedTests,
    getDraftTests,
    
    // Test Creation Helpers
    createLandingPageTest,
    createFormTest,
    createCTATest,
    createHeadlineTest,
    
    // Statistical Analysis
    calculateSampleSize,
    calculateStatisticalPower,
    calculateConfidenceInterval,
    isStatisticallySignificant,
    
    // Recommendations
    getRecommendations,
    getOptimizationSuggestions,
    getNextTestIdeas
  };
};
