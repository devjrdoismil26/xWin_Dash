import { vi } from "vitest";

// Mock data
export const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/john.jpg",
};

export const mockLeads = [
  {
    id: 1,
    name: "Lead 1",
    email: "lead1@example.com",
    status: "new",
    score: 85,
  },
  {
    id: 2,
    name: "Lead 2",
    email: "lead2@example.com",
    status: "qualified",
    score: 92,
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: "success",
    title: "Success notification",
    message: "Operation completed successfully",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: "warning",
    title: "Warning notification",
    message: "Please review your settings",
    read: true,
    created_at: new Date().toISOString(),
  },
];

// Mock API responses
export const mockApiResponse = (data, status = 200) => ({
  data,
  status,
  statusText: "OK",
  headers: {},
  config: {},
});

// Mock functions
export const mockApiCall = vi.fn();
export const mockNavigate = vi.fn();
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock window.location
export const mockLocation = {
  href: "http://localhost:3000",
  pathname: "/",
  search: "",
  hash: "",
  reload: vi.fn(),
  assign: vi.fn(),
  replace: vi.fn(),
};
