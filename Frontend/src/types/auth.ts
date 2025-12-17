/**
 * Tipos de autenticação
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export interface AuthUser extends User {
  token?: string;
  expires_at?: string;
}

export interface AuthProps {
  auth?: {
    user: AuthUser;
  };
}
