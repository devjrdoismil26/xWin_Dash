import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";

// Test wrapper component
export const TestWrapper = ({ children }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => <TestWrapper>{children}</TestWrapper>;

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock Inertia.js
export const mockInertia = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  visit: vi.fn(),
  reload: vi.fn(),
};

// Mock route function
export const mockRoute = vi.fn((name, params) => {
  const routes = {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    "profile.edit": "/profile/edit",
  };

  return routes[name] || `/${name}`;
});

// Wait for async operations
export const waitFor = (callback, timeout = 1000) => {
  return new Promise((resolve, reject) => {
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
        }
      }
    };

    check();
  });
};

// Create mock event
export const createMockEvent = (type, properties = {}) => ({
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
export const mockFetch = (response, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  });
};
