import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Custom render function with providers
export const renderWithProviders = (ui: unknown, options: RenderOptions = {}) => {
  return render(ui, options);};

// Mock Inertia.js
export const mockInertia = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  visit: vi.fn(),
  reload: vi.fn(),};

// Mock route function
export const mockRoute = vi.fn((name: string, params?: string) => {
  const routes: Record<string, string> = {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    "profile.edit": "/profile/edit",};

  return routes[name] || `/${name}`;
});

// Wait for async operations
export const waitFor = (
  callback??: (e: any) => void,
  timeout = 1000,
): Promise<void> => {
  return new Promise((resolve: unknown, reject: unknown) => {
    const startTime = Date.now();

    const check = () => {
      try {
        callback();

        resolve();

      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);

        } else {
          setTimeout(check, 10);

        } };

    check();

  });};

// Create mock event
export const createMockEvent = (type: string, properties: unknown = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: {
    value: "",
    checked: false,
    ...properties.target,
  },
  ...properties,
});

// Mock fetch
export const mockFetch = (response: unknown, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  });};
