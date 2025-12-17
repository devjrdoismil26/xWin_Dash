/**
 * Service de Contas do módulo ADStool
 * @module modules/ADStool/services/adsAccountService
 * @description
 * Service responsável pelo gerenciamento completo de contas de anúncios,
 * incluindo operações CRUD, conexão/desconexão, validação, sincronização,
 * estatísticas e configurações de contas.
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { AdsAccount, AdsAccountStatus, AdsPlatform, AdsResponse } from '../types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Classe AdsAccountService - Service de Contas de Anúncios
 * @class
 * @description
 * Service que gerencia todas as operações relacionadas a contas de anúncios,
 * incluindo busca, criação, atualização, remoção, conexão, validação, sincronização
 * e obtenção de estatísticas e configurações.
 * 
 * @example
 * ```typescript
 * import { adsAccountService } from '@/modules/ADStool/services/adsAccountService';
 * 
 * // Buscar todas as contas
 * const response = await adsAccountService.getAccounts();

 * if (response.success) {
 *   
 * }
 * 
 * // Criar nova conta
 * const newAccount = await adsAccountService.createAccount({
 *   name: 'Minha Conta',
 *   platform: 'google_ads',
 *   account_id: '123456789'
 * });

 * 
 * // Conectar conta
 * const connectResult = await adsAccountService.connectAccount('google_ads', {
 *   access_token: 'token123',
 *   refresh_token: 'refresh123'
 * });

 * ```
 */
class AdsAccountService {
  private api = apiClient;

  /**
   * Busca todas as contas
   * @description
   * Retorna todas as contas de anúncios cadastradas no sistema.
   * @returns {Promise<AdsResponse>} Resposta com lista de contas ou erro
   * @example
   * ```typescript
   * const response = await adsAccountService.getAccounts();

   * if (response.success) {
   *   const accounts = (response as any).data as AdsAccount[];
   *   
   * }
   * ```
   */
  async getAccounts(): Promise<AdsResponse> {
    try {
      const response = await this.api.get('/adstool/accounts') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca conta específica por ID
   * @param {string} accountId - ID da conta a ser buscada
   * @returns {Promise<AdsResponse>} Resposta com dados da conta ou erro
   * @example
   * ```typescript
   * const response = await adsAccountService.getAccountById('123');

   * if (response.success) {
   *   const account = (response as any).data as AdsAccount;
   *   
   * }
   * ```
   */
  async getAccountById(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/${accountId}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Cria nova conta
   * @param {Partial<AdsAccount>} data - Dados parciais da conta a ser criada
   * @returns {Promise<AdsResponse>} Resposta com conta criada ou erro
   * @example
   * ```typescript
   * const response = await adsAccountService.createAccount({
   *   name: 'Nova Conta',
   *   platform: 'facebook_ads',
   *   account_id: '987654321'
   * });

   * ```
   */
  async createAccount(data: Partial<AdsAccount>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/accounts', data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza conta existente
   * @param {string} accountId - ID da conta a ser atualizada
   * @param {Partial<AdsAccount>} data - Dados parciais a serem atualizados
   * @returns {Promise<AdsResponse>} Resposta com conta atualizada ou erro
   */
  async updateAccount(accountId: string, data: Partial<AdsAccount>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/accounts/${accountId}`, data) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Remove conta
   * @param {string} accountId - ID da conta a ser removida
   * @returns {Promise<AdsResponse>} Resposta de sucesso ou erro
   */
  async deleteAccount(accountId: string): Promise<AdsResponse> {
    try {
      await this.api.delete(`/adstool/accounts/${accountId}`);

      return {
        success: true,
        message: 'Conta removida com sucesso'};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Conecta conta com plataforma
   * @param {AdsPlatform} platform - Plataforma de anúncios (google_ads, facebook_ads, etc.)
   * @param {Record<string, any>} credentials - Credenciais de autenticação da plataforma
   * @returns {Promise<AdsResponse>} Resposta com conta conectada ou erro
   */
  async connectAccount(platform: AdsPlatform, credentials: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/accounts/connect', {
        platform,
        credentials
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Desconecta conta
   * @param {string} accountId - ID da conta a ser desconectada
   * @returns {Promise<AdsResponse>} Resposta de sucesso ou erro
   */
  async disconnectAccount(accountId: string): Promise<AdsResponse> {
    try {
      await this.api.post(`/adstool/accounts/${accountId}/disconnect`);

      return {
        success: true,
        message: 'Conta desconectada com sucesso'};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza status da conta
   */
  async updateAccountStatus(accountId: string, status: AdsAccountStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/accounts/${accountId}/status`, { status }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Sincroniza dados da conta
   * @param {string} accountId - ID da conta a ser sincronizada
   * @returns {Promise<AdsResponse>} Resposta com dados sincronizados ou erro
   */
  async syncAccount(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.post(`/adstool/accounts/${accountId}/sync`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca contas por plataforma
   */
  async getAccountsByPlatform(platform: AdsPlatform): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/platform/${platform}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca contas por status
   * @param {AdsAccountStatus} status - Status das contas (active, paused, suspended, pending)
   * @returns {Promise<AdsResponse>} Resposta com lista de contas com o status ou erro
   */
  async getAccountsByStatus(status: AdsAccountStatus): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/status/${status}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Valida credenciais da conta
   * @param {AdsPlatform} platform - Plataforma de anúncios
   * @param {Record<string, any>} credentials - Credenciais a serem validadas
   * @returns {Promise<AdsResponse>} Resposta com resultado da validação ou erro
   */
  async validateAccountCredentials(platform: AdsPlatform, credentials: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.post('/adstool/accounts/validate', {
        platform,
        credentials
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca estatísticas da conta
   * @param {string} accountId - ID da conta
   * @param {string} [period] - Período das estatísticas (opcional)
   * @returns {Promise<AdsResponse>} Resposta com estatísticas da conta ou erro
   */
  async getAccountStats(accountId: string, period?: string): Promise<AdsResponse> {
    try {
      const params = period ? { period } : {};

      const response = await this.api.get(`/adstool/accounts/${accountId}/stats`, { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza orçamento da conta
   */
  async updateAccountBudget(accountId: string, budget: number): Promise<AdsResponse> {
    try {
      const response = await this.api.patch(`/adstool/accounts/${accountId}/budget`, { budget }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca configurações da conta
   * @param {string} accountId - ID da conta
   * @returns {Promise<AdsResponse>} Resposta com configurações da conta ou erro
   */
  async getAccountSettings(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/${accountId}/settings`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Atualiza configurações da conta
   * @param {string} accountId - ID da conta
   * @param {Record<string, any>} settings - Configurações a serem atualizadas
   * @returns {Promise<AdsResponse>} Resposta com conta atualizada ou erro
   */
  async updateAccountSettings(accountId: string, settings: Record<string, any>): Promise<AdsResponse> {
    try {
      const response = await this.api.put(`/adstool/accounts/${accountId}/settings`, settings) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Testa conexão da conta
   * @param {string} accountId - ID da conta a ser testada
   * @returns {Promise<AdsResponse>} Resposta com resultado do teste ou erro
   */
  async testAccountConnection(accountId: string): Promise<AdsResponse> {
    try {
      const response = await this.api.get(`/adstool/accounts/${accountId}/test`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } /**
   * Busca histórico de atividades da conta
   */
  async getAccountActivity(accountId: string, limit?: number): Promise<AdsResponse> {
    try {
      const params = limit ? { limit } : {};

      const response = await this.api.get(`/adstool/accounts/${accountId}/activity`, { params }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } }

/**
 * Instância singleton do AdsAccountService
 * @constant adsAccountService
 * @type {AdsAccountService}
 */
export const adsAccountService = new AdsAccountService();

export default adsAccountService;
