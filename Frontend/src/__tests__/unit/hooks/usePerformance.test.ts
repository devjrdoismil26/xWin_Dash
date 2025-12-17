import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePerformance } from '@/hooks/usePerformance';

// Mock performance API
const mockPerformance = {
  now: vi.fn(),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  getEntriesByName: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),};

Object.defineProperty(window, "performance", {
  value: mockPerformance,
  writable: true,
});

// Mock requestIdleCallback
const mockRequestIdleCallback = vi.fn();

Object.defineProperty(window, "requestIdleCallback", {
  value: mockRequestIdleCallback,
  writable: true,
});

// Mock requestAnimationFrame
const mockRequestAnimationFrame = vi.fn();

Object.defineProperty(window, "requestAnimationFrame", {
  value: mockRequestAnimationFrame,
  writable: true,
});

describe("usePerformance", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPerformance.now.mockReturnValue(1000);

  });

  it("initializes with default performance metrics", () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.metrics).toEqual({
      renderTime: 0,
      memoryUsage: 0,
      fps: 0,
      networkLatency: 0,
      bundleSize: 0,
    });

    expect(result.current.isMonitoring).toBe(false);

  });

  it("starts performance monitoring", () => {
    const { result } = renderHook(() => usePerformance());

    act(() => {
      result.current.startMonitoring();

    });

    expect(result.current.isMonitoring).toBe(true);

    expect(mockRequestIdleCallback).toHaveBeenCalled();

  });

  it("stops performance monitoring", () => {
    const { result } = renderHook(() => usePerformance());

    act(() => {
      result.current.startMonitoring();

    });

    expect(result.current.isMonitoring).toBe(true);

    act(() => {
      result.current.stopMonitoring();

    });

    expect(result.current.isMonitoring).toBe(false);

  });

  it("measures render time", async () => {
    const { result } = renderHook(() => usePerformance());

    mockPerformance.now
      .mockReturnValueOnce(1000) // Start time
      .mockReturnValueOnce(1500); // End time

    await act(async () => {
      const measureRender = result.current.measureRenderTime("test-component");

      measureRender();

    });

    expect(mockPerformance.mark).toHaveBeenCalledWith("test-component-start");

    expect(mockPerformance.mark).toHaveBeenCalledWith("test-component-end");

    expect(mockPerformance.measure).toHaveBeenCalledWith(
      "test-component-render",
      "test-component-start",
      "test-component-end",);

  });

  it("tracks memory usage", () => {
    const { result } = renderHook(() => usePerformance());

    // Mock memory API
    const mockMemory = {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,};

    Object.defineProperty(window.performance, "memory", {
      value: mockMemory,
      writable: true,
    });

    act(() => {
      result.current.trackMemoryUsage();

    });

    expect(result.current.metrics.memoryUsage).toBe(1000000);

  });

  it("measures FPS", () => {
    const { result } = renderHook(() => usePerformance());

    let frameCount = 0;
    mockRequestAnimationFrame.mockImplementation((callback) => {
      frameCount++;
      if (frameCount <= 60) {
        setTimeout(() => callback(performance.now() + 16.67), 16.67);

      }
      return frameCount;
    });

    act(() => {
      result.current.measureFPS();

    });

    // Should start measuring FPS
    expect(mockRequestAnimationFrame).toHaveBeenCalled();

  });

  it("measures network latency", async () => {
    const { result } = renderHook(() => usePerformance());

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers(),
    });

    await act(async () => {
      await result.current.measureNetworkLatency("/api/test");

    });

    expect(global.fetch).toHaveBeenCalledWith("/api/test", {
      method: "HEAD",
      cache: "no-cache",
    });

  });

  it("tracks bundle size", () => {
    const { result } = renderHook(() => usePerformance());

    // Mock performance entries
    mockPerformance.getEntriesByType.mockReturnValue([
      { name: "main.js", transferSize: 100000 },
      { name: "vendor.js", transferSize: 200000 },
      { name: "styles.css", transferSize: 50000 },
    ]);

    act(() => {
      result.current.trackBundleSize();

    });

    expect(result.current.metrics.bundleSize).toBe(350000);

  });

  it("provides performance report", () => {
    const { result } = renderHook(() => usePerformance());

    // Set some metrics
    act(() => {
      result.current.setMetrics({
        renderTime: 100,
        memoryUsage: 1000000,
        fps: 60,
        networkLatency: 50,
        bundleSize: 500000,
      });

    });

    const report = result.current.getPerformanceReport();

    expect(report).toEqual({
      renderTime: 100,
      memoryUsage: 1000000,
      fps: 60,
      networkLatency: 50,
      bundleSize: 500000,
      score: expect.any(Number),
      recommendations: expect.any(Array),
    });

  });

  it("calculates performance score", () => {
    const { result } = renderHook(() => usePerformance());

    // Good performance metrics
    act(() => {
      result.current.setMetrics({
        renderTime: 16, // Good
        memoryUsage: 50000000, // Good
        fps: 60, // Good
        networkLatency: 100, // Good
        bundleSize: 500000, // Good
      });

    });

    const score = result.current.calculatePerformanceScore();

    expect(score).toBeGreaterThan(80);

    // Poor performance metrics
    act(() => {
      result.current.setMetrics({
        renderTime: 100, // Poor
        memoryUsage: 200000000, // Poor
        fps: 30, // Poor
        networkLatency: 1000, // Poor
        bundleSize: 2000000, // Poor
      });

    });

    const poorScore = result.current.calculatePerformanceScore();

    expect(poorScore).toBeLessThan(50);

  });

  it("provides performance recommendations", () => {
    const { result } = renderHook(() => usePerformance());

    // Set poor performance metrics
    act(() => {
      result.current.setMetrics({
        renderTime: 100,
        memoryUsage: 200000000,
        fps: 30,
        networkLatency: 1000,
        bundleSize: 2000000,
      });

    });

    const recommendations = result.current.getPerformanceRecommendations();

    expect(recommendations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: expect.any(String),
          message: expect.any(String),
          priority: expect.any(String),
        }),
      ]),);

  });

  it("handles performance thresholds", () => {
    const { result } = renderHook(() => usePerformance());

    const thresholds = {
      renderTime: 50,
      memoryUsage: 100000000,
      fps: 45,
      networkLatency: 500,
      bundleSize: 1000000,};

    act(() => {
      result.current.setThresholds(thresholds);

    });

    // Set metrics that exceed thresholds
    act(() => {
      result.current.setMetrics({
        renderTime: 100,
        memoryUsage: 200000000,
        fps: 30,
        networkLatency: 1000,
        bundleSize: 2000000,
      });

    });

    const violations = result.current.getThresholdViolations();

    expect(violations).toHaveLength(5);

  });

  it("tracks component performance", () => {
    const { result } = renderHook(() => usePerformance());

    act(() => {
      result.current.trackComponentPerformance("TestComponent", () => {
        // Simulate component work
        return "rendered";
      });

    });

    expect(mockPerformance.mark).toHaveBeenCalledWith("TestComponent-start");

    expect(mockPerformance.mark).toHaveBeenCalledWith("TestComponent-end");

  });

  it("handles performance errors gracefully", () => {
    const { result } = renderHook(() => usePerformance());

    // Mock performance API to throw error
    mockPerformance.now.mockImplementation(() => {
      throw new Error("Performance API error");

    });

    expect(() => {
      act(() => {
        result.current.measureRenderTime("test")();

      });

    }).not.toThrow();

  });

  it("cleans up performance monitoring on unmount", () => {
    const { result, unmount } = renderHook(() => usePerformance());

    act(() => {
      result.current.startMonitoring();

    });

    unmount();

    // Should clean up monitoring
    expect(result.current.isMonitoring).toBe(false);

  });

  it("debounces performance measurements", async () => {
    const { result } = renderHook(() => usePerformance());

    const measureFn = vi.fn();

    const debouncedMeasure = result.current.debouncePerformanceMeasure(
      measureFn,
      100,);

    // Call multiple times quickly
    debouncedMeasure();

    debouncedMeasure();

    debouncedMeasure();

    // Should only call once after debounce period
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));

    });

    expect(measureFn).toHaveBeenCalledTimes(1);

  });

});
