/**
 * Serviço de Autenticação - Gerenciamento de Autenticação e Usuários
 *
 * @description
 * Serviço responsável por todas as operações relacionadas à autenticação e
 * gerenciamento de usuários. Estende BaseService para aproveitar métodos HTTP
 * padronizados e inclui funcionalidades específicas de autenticação.
 *
 * Funcionalidades principais:
 * - Login e logout de usuários
 * - Registro de novos usuários
 * - Recuperação e redefinição de senha
 * - Gerenciamento de perfil do usuário
 * - Alteração de senha
 * - Verificação de email
 * - Refresh de tokens
 * - Gerenciamento de localStorage (tokens, usuário atual)
 * - Verificação de permissões e roles
 *
 * @module services/global/authService
 * @since 1.0.0
 *
 * @example
 * ```ts
 * import authService from '@/services/global/authService';
 *
 * // Login
 * const response = await authService.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });

 *
 * // Verificar autenticação
 * if (authService.isAuthenticated()) {
 *   const user = authService.getCurrentUser();

 * }
 *
 * // Logout
 * await authService.logout();

 * ```
 */

import { AxiosError } from 'axios';
import { BaseService } from '../http/baseService';
import { LoginCredentials, RegisterData, ForgotPasswordData, ResetPasswordData, AuthResponse, User, ApiResponse } from '../http/types';

/**
 * Classe AuthService - Serviço de Autenticação
 *
 * @description
 * Classe que estende BaseService e fornece métodos específicos para
 * autenticação, gerenciamento de usuários e controle de acesso.
 *
 * @class AuthService
 * @extends BaseService
 * @since 1.0.0
 */
class AuthService extends BaseService {
  /**
   * Constrói uma nova instância do AuthService
   *
   * @description
   * Inicializa o serviço com a URL base '/auth' para todas as operações
   * de autenticação e gerenciamento de usuários.
   *
   * @example
   * ```ts
   * const authService = new AuthService();

   * // Configurado para usar '/auth' como baseURL
   * ```
   */
  constructor() {
    super('/auth');

  }

  // ========================================
  // MÉTODOS DE AUTENTICAÇÃO
  // ========================================

  /**
   * Realiza o login de um usuário
   *
   * @description
   * Autentica um usuário com email e senha, valida as credenciais,
   * armazena o token e dados do usuário no localStorage e configura
   * o token no cliente HTTP para requisições subsequentes.
   *
   * @param {LoginCredentials} credentials - Credenciais de login (email e senha)
   * @returns {Promise<ApiResponse<AuthResponse>>} Promise com resposta contendo token e dados do usuário
   *
   * @example
   * ```ts
   * const response = await authService.login({
   *   email: 'user@example.com',
   *   password: 'password123',
   *   remember: true
   * });

   *
   * if (response.success) {
   * }
   * ```
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    this.validateRequired(credentials, ['email', 'password']);

    if (!this.validateEmail(credentials.email)) {
      return {
        success: false,
        error: 'Email inválido'};

    }

    const response = await this.post<AuthResponse>('/login', credentials);

    if (response.success && (response as any).data?.token) {
      // Armazenar token e dados do usuário
      localStorage.setItem('auth_token', (response as any).data.token);

      localStorage.setItem('current_user', JSON.stringify(response.data.user));

      // Configurar token no cliente HTTP
      this.api.setAuthToken(response.data.token);

    }
    
    return response;
  }

  /**
   * Realiza o logout de um usuário
   *
   * @description
   * Envia requisição de logout ao backend e remove todos os dados de
   * autenticação do localStorage (token, usuário atual, projeto atual)
   * e do cliente HTTP. Limpa os dados locais mesmo se a requisição falhar.
   *
   * @returns {Promise<ApiResponse<void>>} Promise com resposta de logout
   *
   * @example
   * ```ts
   * const response = await authService.logout();

   * // Dados de autenticação foram removidos
   * ```
   */
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.post<void>('/logout');

      // Limpar dados de autenticação
      this.clearAuthData();

      return response;
    } catch (error: unknown) {
      // Mesmo com erro, limpar dados locais
      this.clearAuthData();

      return this.handleError(error as AxiosError);

    } /**
   * Registra um novo usuário
   *
   * @description
   * Cria uma nova conta de usuário após validar os dados fornecidos
   * (campos obrigatórios, formato de email, senhas coincidem, tamanho mínimo
   * da senha, termos aceitos). Se bem-sucedido, armazena token e dados do
   * usuário no localStorage e configura o token no cliente HTTP.
   *
   * @param {RegisterData} userData - Dados do novo usuário (nome, email, senha, etc.)
   * @returns {Promise<ApiResponse<AuthResponse>>} Promise com resposta contendo token e dados do usuário
   *
   * @example
   * ```ts
   * const response = await authService.register({
   *   name: 'John Doe',
   *   email: 'john@example.com',
   *   password: 'password123',
   *   password_confirmation: 'password123',
   *   terms_accepted: true
   * });

   * ```
   */
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    this.validateRequired(userData, ['name', 'email', 'password', 'password_confirmation']);

    if (!this.validateEmail(userData.email)) {
      return {
        success: false,
        error: 'Email inválido'};

    }

    if (userData.password !== userData.password_confirmation) {
      return {
        success: false,
        error: 'Senhas não coincidem'};

    }

    if (userData.password.length < 8) {
      return {
        success: false,
        error: 'Senha deve ter pelo menos 8 caracteres'};

    }

    if (!userData.terms_accepted) {
      return {
        success: false,
        error: 'Você deve aceitar os termos de uso'};

    }

    const response = await this.post<AuthResponse>('/register', userData);

    if (response.success && (response as any).data?.token) {
      // Armazenar token e dados do usuário
      localStorage.setItem('auth_token', (response as any).data.token);

      localStorage.setItem('current_user', JSON.stringify(response.data.user));

      // Configurar token no cliente HTTP
      this.api.setAuthToken(response.data.token);

    }
    
    return response;
  }

  /**
   * Solicita recuperação de senha
   *
   * @description
   * Envia uma requisição para o backend solicitar a recuperação de senha
   * via email. Valida se o email está presente e em formato válido.
   *
   * @param {ForgotPasswordData} data - Dados para recuperação (email)
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da requisição
   *
   * @example
   * ```ts
   * const response = await authService.forgotPassword({
   *   email: 'user@example.com'
   * });

   * ```
   */
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<void>> {
    this.validateRequired(data, ['email']);

    if (!this.validateEmail(data.email)) {
      return {
        success: false,
        error: 'Email inválido'};

    }

    return this.post<void>('/forgot-password', data);

  }

  /**
   * Redefine a senha do usuário
   *
   * @description
   * Redefine a senha do usuário usando o token de redefinição recebido por email.
   * Valida campos obrigatórios, formato de email, senhas coincidem e tamanho
   * mínimo da senha. Se bem-sucedido, armazena o novo token e dados do usuário
   * no localStorage e configura o token no cliente HTTP.
   *
   * @param {ResetPasswordData} data - Dados para redefinição (token, email, senha, confirmação)
   * @returns {Promise<ApiResponse<AuthResponse>>} Promise com resposta contendo token e dados do usuário
   *
   * @example
   * ```ts
   * const response = await authService.resetPassword({
   *   token: 'reset-token-from-email',
   *   email: 'user@example.com',
   *   password: 'newpassword123',
   *   password_confirmation: 'newpassword123'
   * });

   * ```
   */
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<AuthResponse>> {
    this.validateRequired(data, ['token', 'email', 'password', 'password_confirmation']);

    if (!this.validateEmail(data.email)) {
      return {
        success: false,
        error: 'Email inválido'};

    }

    if (data.password !== (data as any).password_confirmation) {
      return {
        success: false,
        error: 'Senhas não coincidem'};

    }

    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Senha deve ter pelo menos 8 caracteres'};

    }

    const response = await this.post<AuthResponse>('/reset-password', data);

    if (response.success && (response as any).data?.token) {
      // Armazenar token e dados do usuário
      localStorage.setItem('auth_token', (response as any).data.token);

      localStorage.setItem('current_user', JSON.stringify(response.data.user));

      // Configurar token no cliente HTTP
      this.api.setAuthToken(response.data.token);

    }
    
    return response;
  }

  // ========================================
  // MÉTODOS DE USUÁRIO
  // ========================================

  /**
   * Obtém os dados do usuário autenticado
   *
   * @description
   * Busca os dados completos do usuário autenticado do backend.
   * Requer autenticação válida.
   *
   * @returns {Promise<ApiResponse<User>>} Promise com dados do usuário
   *
   * @example
   * ```ts
   * const response = await authService.getUser();

   * if (response.success) {
   * }
   * ```
   */
  async getUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/user');

  }

  /**
   * Atualiza o perfil do usuário autenticado
   *
   * @description
   * Atualiza parcialmente os dados do perfil do usuário autenticado.
   * Valida o formato do email se fornecido. Atualiza os dados do usuário
   * no localStorage após sucesso.
   *
   * @param {Partial<User>} data - Dados parciais do perfil a serem atualizados
   * @returns {Promise<ApiResponse<User>>} Promise com dados atualizados do usuário
   *
   * @example
   * ```ts
   * const response = await authService.updateProfile({
   *   name: 'John Updated',
   *   avatar: 'https://example.com/avatar.jpg'
   * });

   * ```
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    if (data.email && !this.validateEmail(data.email)) {
      return {
        success: false,
        error: 'Email inválido'};

    }

    const response = await this.put<User>('/profile', data);

    if (response.success && (response as any).data) {
      // Atualizar dados do usuário no localStorage
      localStorage.setItem('current_user', JSON.stringify(response.data));

    }
    
    return response;
  }

  /**
   * Altera a senha do usuário autenticado
   *
   * @description
   * Altera a senha do usuário autenticado após validar que todos os campos
   * obrigatórios estão presentes, as novas senhas coincidem e a nova senha
   * atende ao tamanho mínimo (8 caracteres).
   *
   * @param {Object} data - Dados para alteração de senha
   * @param {string} (data as any).current_password - Senha atual do usuário
   * @param {string} (data as any).new_password - Nova senha
   * @param {string} (data as any).new_password_confirmation - Confirmação da nova senha
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da alteração
   *
   * @example
   * ```ts
   * const response = await authService.changePassword({
   *   current_password: 'oldpassword123',
   *   new_password: 'newpassword123',
   *   new_password_confirmation: 'newpassword123'
   * });

   * ```
   */
  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<ApiResponse<void>> {
    this.validateRequired(data, ['current_password', 'new_password', 'new_password_confirmation']);

    if (data.new_password !== (data as any).new_password_confirmation) {
      return {
        success: false,
        error: 'Senhas não coincidem'};

    }

    if (data.new_password.length < 8) {
      return {
        success: false,
        error: 'Senha deve ter pelo menos 8 caracteres'};

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
    } /**
   * Obtém o token de autenticação do localStorage
   *
   * @description
   * Recupera o token de autenticação armazenado no localStorage.
   * Retorna null se não houver token.
   *
   * @returns {string | null} Token de autenticação ou null se não existir
   *
   * @example
   * ```ts
   * const token = authService.getAuthToken();

   * if (token) {
   *   // Token disponível
   * }
   * ```
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');

  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();

  }

  /**
   * Limpa todos os dados de autenticação
   *
   * @description
   * Remove todos os dados de autenticação do localStorage (token, usuário atual,
   * projeto atual) e remove o token do cliente HTTP. Usado principalmente em
   * logout, mas também pode ser chamado para limpar dados inválidos.
   *
   * @returns {void}
   *
   * @example
   * ```ts
   * authService.clearAuthData();

   * // Todos os dados de autenticação foram removidos
   * ```
   */
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

  /**
   * Verifica se o usuário tem um role específico
   *
   * @description
   * Verifica se o usuário atual possui um role específico.
   * Retorna false se o usuário não estiver autenticado ou não tiver o role.
   *
   * @param {string} role - Nome do role a ser verificado
   * @returns {boolean} true se o usuário tiver o role, false caso contrário
   *
   * @example
   * ```ts
   * if (authService.hasRole('admin')) {
   *   // Usuário é administrador
   * }
   * ```
   */
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

  /**
   * Atualiza o token de autenticação
   *
   * @description
   * Solicita um novo token de autenticação ao backend usando o token atual.
   * Se bem-sucedido, atualiza o token no localStorage e no cliente HTTP.
   * Usado para manter a sessão do usuário ativa.
   *
   * @returns {Promise<ApiResponse<AuthResponse>>} Promise com novo token e dados do usuário
   *
   * @example
   * ```ts
   * const response = await authService.refreshToken();

   * if (response.success) {
   *   // Token atualizado com sucesso
   * }
   * ```
   */
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const response = await this.post<AuthResponse>('/refresh');

    if (response.success && (response as any).data?.token) {
      // Atualizar token
      localStorage.setItem('auth_token', (response as any).data.token);

      this.api.setAuthToken(response.data.token);

    }
    
    return response;
  }

  /**
   * Verifica o email do usuário usando um token
   *
   * @description
   * Verifica o email do usuário usando o token recebido por email.
   * Valida o token no backend e marca o email como verificado.
   *
   * @param {string} token - Token de verificação recebido por email
   * @returns {Promise<ApiResponse<void>>} Promise com resposta da verificação
   *
   * @example
   * ```ts
   * const response = await authService.verifyEmail('verification-token');

   * if (response.success) {
   *   // Email verificado com sucesso
   * }
   * ```
   */
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return this.post<void>('/verify-email', { token });

  }

  /**
   * Reenvia o email de verificação
   *
   * @description
   * Solicita ao backend que reenvie o email de verificação para o
   * usuário autenticado. Usado quando o usuário não recebeu o email
   * original ou quando o token expirou.
   *
   * @returns {Promise<ApiResponse<void>>} Promise com resposta do reenvio
   *
   * @example
   * ```ts
   * const response = await authService.resendVerificationEmail();

   * if (response.success) {
   *   // Email de verificação reenviado
   * }
   * ```
   */
  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return this.post<void>('/resend-verification');

  } // ========================================
// INSTÂNCIA GLOBAL
// ========================================

/**
 * Instância global do AuthService
 *
 * @description
 * Instância única e compartilhada do AuthService configurada com a URL base '/auth'.
 * Esta é a instância recomendada para uso na maioria dos casos, evitando a criação
 * de múltiplas instâncias desnecessárias.
 *
 * @constant {AuthService}
 * @global
 *
 * @example
 * ```ts
 * import authService from '@/services/global/authService';
 *
 * // Usar a instância global
 * await authService.login(credentials: unknown);

 * ```
 */
const authService = new AuthService();

// ========================================
// EXPORTS
// ========================================

export { AuthService, authService };

export default authService;
