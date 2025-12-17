import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Declarações de tipos globais
declare global {
  var route: (name: string, params?: string) => string;
  var router: unknown;
  var ziggy: unknown;
  var Echo: unknown;
  var Pusher: unknown;
}

// Mock do Inertia.js
global.route = (name: string, params?: string) => {
  const routes: Record<string, string> = {
    'dashboard': '/dashboard',
    'leads.index': '/leads',
    'leads.create': '/leads/create',
    'leads.edit': '/leads/:id/edit',
    'projects.index': '/projects',
    'projects.create': '/projects/create',
    'projects.edit': '/projects/:id/edit',
    'ai.index': '/ai',
    'email-marketing.index': '/email-marketing',
    'social-buffer.index': '/social-buffer',
    'workflows.index': '/workflows',
    'aura.index': '/aura',
    'ads-tool.index': '/ads-tool',
    'analytics.index': '/analytics',
    'media-library.index': '/media-library',
    'settings.index': '/settings',
    'activity.index': '/activity',
    'users.index': '/users',};

  let route = routes[name] || `/${name}`;
  
  if (params) {
    Object.keys(params).forEach(key => {
      route = route.replace(`:${key}`, params[key]);

    });

  }
  
  return route;};

// Mock do router do Inertia
global.router = {
  visit: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  remember: vi.fn(),
  restore: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),};

// Mock do Ziggy
global.ziggy = {
  routes: {},
  url: 'http://localhost',
  port: null,
  defaults: {},
  location: 'http://localhost'};

// Mock do Laravel Echo
global.Echo = {
  channel: () => ({
    listen: () => {},
    stopListening: () => {},
    subscribed: () => true,
    error: () => {} ),
  private: () => ({
    listen: () => {},
    stopListening: () => {},
    subscribed: () => true,
    error: () => {} ),
  join: () => ({
    listen: () => {},
    stopListening: () => {},
    subscribed: () => true,
    error: () => {} ),
  leave: () => {},
  disconnect: () => {} ;

// Mock do Pusher
global.Pusher = class MockPusher {
  constructor() {}
  subscribe() { return this; }
  unsubscribe() { return this; }
  bind() { return this; }
  unbind() { return this; }
  trigger() { return this; } ;

// Setup do servidor MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Cleanup após cada teste
afterEach(() => {
  cleanup();

  server.resetHandlers();

});

// Fechar servidor após todos os testes
afterAll(() => server.close());

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),};

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock do fetch
global.fetch = vi.fn();

// Mock do console para evitar logs durante testes
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),};
