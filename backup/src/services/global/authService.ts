// ========================================
// SERVIÇO DE AUTENTICAÇÃO
// ========================================

import { BaseService } from '../http/baseService';
import { 
  LoginCredentials, 
  RegisterData, 
  ForgotPasswordData, 
  ResetPasswordData, 
  AuthResponse, 
  User,
  ApiResponse 
} from '../http/types';

class AuthService extends BaseService {
  constructor() {
    super('/auth');
  }

  // ========================================
  // MÉTODOS DE AUTENTICAÇÃO
  // ========================================

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    this.validateRequired(credentials, ['email', 'password']);
    
    if (!this.validateEmail(credentials.email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    const response = await this.post<AuthResponse>('/login', credentials);
    
    if (response.success && response.data?.token) {
      // Armazenar token e dados do usuário
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user));
      
      // Configurar token no cliente HTTP
      this.api.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.post<void>('/logout');
      
      // Limpar dados de autenticação
      this.clearAuthData();
      
      return response;
    } catch (error: any) {
      // Mesmo com erro, limpar dados locais
      this.clearAuthData();
      return this.handleError(error);
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    this.validateRequired(userData, ['name', 'email', 'password', 'password_confirmation']);
    
    if (!this.validateEmail(userData.email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    if (userData.password !== userData.password_confirmation) {
      return {
        success: false,
        error: 'Senhas não coincidem'
      };
    }

    if (userData.password.length < 8) {
      return {
        success: false,
        error: 'Senha deve ter pelo menos 8 caracteres'
      };
    }

    if (!userData.terms_accepted) {
      return {
        success: false,
        error: 'Você deve aceitar os termos de uso'
      };
    }

    const response = await this.post<AuthResponse>('/register', userData);
    
    if (response.success && response.data?.token) {
      // Armazenar token e dados do usuário
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user));
      
      // Configurar token no cliente HTTP
      this.api.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    this.validateRequired(data, ['email']);
    
    if (!this.validateEmail(data.email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    return this.post<void>('/forgot-password', data);
  }

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<AuthResponse>> {
    this.validateRequired(data, ['token', 'email', 'password', 'password_confirmation']);
    
    if (!this.validateEmail(data.email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    if (data.password !== data.password_confirmation) {
      return {
        success: false,
        error: 'Senhas não coincidem'
      };
    }

    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Senha deve ter pelo menos 8 caracteres'
      };
    }

    const response = await this.post<AuthResponse>('/reset-password', data);
    
    if (response.success && response.data?.token) {
      // Armazenar token e dados do usuário
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_user', JSON.stringify(response.data.user));
      
      // Configurar token no cliente HTTP
      this.api.setAuthToken(response.data.token);
    }
    
    return response;
  }

  // ========================================
  // MÉTODOS DE USUÁRIO
  // ========================================

  async getUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/user');
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    if (data.email && !this.validateEmail(data.email)) {
      return {
        success: false,
        error: 'Email inválido'
      };
    }

    const response = await this.put<User>('/profile', data);
    
    if (response.success && response.data) {
      // Atualizar dados do usuário no localStorage
      localStorage.setItem('current_user', JSON.stringify(response.data));
    }
    
    return response;
  }

  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<ApiResponse<void>> {
    this.validateRequired(data, ['current_password', 'new_password', 'new_password_confirmation']);
    
    if (data.new_password !== data.new_password_confirmation) {
      return {
        success: false,
        error: 'Senhas não coincidem'
      };
    }

    if (data.new_password.length < 8) {
      return {
        success: false,
        error: 'Senha deve ter pelo menos 8 caracteres'
      };
    }

    return this.post<void>('/change-password', data);
  }

  // ========================================
  // MÉTODOS DE UTILIDADE
  // ========================================

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('current_project_id');
    this.api.removeAuthToken();
  }

  // ========================================
  // MÉTODOS DE VERIFICAÇÃO
  // ========================================

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isEmailVerified(): boolean {
    const user = this.getCurrentUser();
    return !!user?.email_verified_at;
  }

  // ========================================
  // MÉTODOS DE REFRESH
  // ========================================

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>('/refresh');
    
    if (response.success && response.data?.token) {
      // Atualizar token
      localStorage.setItem('auth_token', response.data.token);
      this.api.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.post<void>('/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return this.post<void>('/resend-verification');
  }
}

// ========================================
// INSTÂNCIA GLOBAL
// ========================================

const authService = new AuthService();

// ========================================
// EXPORTS
// ========================================

export { AuthService, authService };
export default authService;
