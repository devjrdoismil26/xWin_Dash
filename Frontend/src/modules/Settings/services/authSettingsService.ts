/**
 * Serviço especializado para configurações de autenticação
 * Gerencia configurações de segurança e autenticação
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { Setting, SettingsResponse, SettingsFilters } from '../types';

class AuthSettingsService {
  private api = apiClient;

  /**
   * Busca configurações de autenticação
   */
  async getAuthSettings(filters: SettingsFilters = {}): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings', { params: filters });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configuração de autenticação
   */
  async updateAuthSetting(key: string, value: unknown): Promise<SettingsResponse> {
    try {
      const response = await this.api.put(`/settings/auth/${key}`, { value });

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de 2FA
   */
  async get2FASettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/2fa');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de 2FA
   */
  async update2FASettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/2fa', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Ativa 2FA
   */
  async enable2FA(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/2fa/enable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Desativa 2FA
   */
  async disable2FA(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/2fa/disable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de OAuth
   */
  async getOAuthSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/oauth');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de OAuth
   */
  async updateOAuthSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/oauth', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Ativa OAuth
   */
  async enableOAuth(provider: string): Promise<SettingsResponse> {
    try {
      const response = await this.api.post(`/settings/auth/oauth/${provider}/enable`);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Desativa OAuth
   */
  async disableOAuth(provider: string): Promise<SettingsResponse> {
    try {
      const response = await this.api.post(`/settings/auth/oauth/${provider}/disable`);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de sessão
   */
  async getSessionSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/session');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de sessão
   */
  async updateSessionSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/session', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de senha
   */
  async getPasswordSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/password');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de senha
   */
  async updatePasswordSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/password', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de bloqueio de conta
   */
  async getAccountLockoutSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/account-lockout');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de bloqueio de conta
   */
  async updateAccountLockoutSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/account-lockout', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de IP
   */
  async getIPSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/ip');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de IP
   */
  async updateIPSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/ip', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de auditoria
   */
  async getAuditSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/audit');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de auditoria
   */
  async updateAuditSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/audit', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de captcha
   */
  async getCaptchaSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/captcha');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de captcha
   */
  async updateCaptchaSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/captcha', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Ativa captcha
   */
  async enableCaptcha(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/captcha/enable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Desativa captcha
   */
  async disableCaptcha(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/captcha/disable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Busca configurações de SSO
   */
  async getSSOSettings(): Promise<SettingsResponse> {
    try {
      const response = await this.api.get('/api/v1/core/settings/sso');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Atualiza configurações de SSO
   */
  async updateSSOSettings(settings: Record<string, any>): Promise<SettingsResponse> {
    try {
      const response = await this.api.put('/api/v1/core/settings/sso', settings);

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Ativa SSO
   */
  async enableSSO(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/sso/enable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } /**
   * Desativa SSO
   */
  async disableSSO(): Promise<SettingsResponse> {
    try {
      const response = await this.api.post('/api/v1/core/settings/sso/disable');

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } }

export const authSettingsService = new AuthSettingsService();

export default authSettingsService;
