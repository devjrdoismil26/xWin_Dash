// =========================================
// SOCIAL BUFFER ERROR STATE - SOCIAL BUFFER
// =========================================

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Wifi, Server, Shield, Clock } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { Animated } from '@/shared/components/ui/AdvancedAnimations';

// =========================================
// INTERFACES
// =========================================

interface ErrorStateProps {
  type?: 'network' | 'server' | 'permission' | 'timeout' | 'validation' | 'any';
  title?: string;
  message?: string;
  details?: string;
  onRetry???: (e: any) => void;
  onGoHome???: (e: any) => void;
  onReportBug???: (e: any) => void;
  showRetry?: boolean;
  showGoHome?: boolean;
  showReportBug?: boolean;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

interface ErrorTypeConfig {
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
  bgColor: string;
  borderColor: string; }

// =========================================
// CONFIGURAÇÕES DE TIPOS DE ERRO
// =========================================

const errorTypes: Record<string, ErrorTypeConfig> = {
  network: {
    icon: <Wifi className="w-12 h-12" />,
    title: 'Erro de Conexão',
    message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  server: {
    icon: <Server className="w-12 h-12" />,
    title: 'Erro do Servidor',
    message: 'O servidor está temporariamente indisponível. Tente novamente em alguns minutos.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  permission: {
    icon: <Shield className="w-12 h-12" />,
    title: 'Acesso Negado',
    message: 'Você não tem permissão para acessar este recurso. Entre em contato com o administrador.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  timeout: {
    icon: <Clock className="w-12 h-12" />,
    title: 'Tempo Esgotado',
    message: 'A operação demorou muito para ser concluída. Tente novamente.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  validation: {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'Dados Inválidos',
    message: 'Os dados fornecidos não são válidos. Verifique as informações e tente novamente.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  any: {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'Erro Inesperado',
    message: 'Ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  } ;

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SocialBufferErrorState: React.FC<ErrorStateProps> = ({ type = 'any',
  title,
  message,
  details,
  onRetry,
  onGoHome,
  onReportBug,
  showRetry = true,
  showGoHome = true,
  showReportBug = true,
  className = ''
   }) => {
  const errorConfig = errorTypes[type] || errorTypes.any;
  
  const finalTitle = title || errorConfig.title;
  const finalMessage = message || errorConfig.message;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();

    } else {
      // Retry padrão - recarregar a página
      window.location.reload();

    } ;

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();

    } else {
      // Navegar para home padrão
      window.location.href = '/social-buffer';
    } ;

  const handleReportBug = () => {
    if (onReportBug) {
      onReportBug();

    } else {
      // Abrir modal de reportar bug ou redirecionar
    } ;

  return (
        <>
      <div className={`flex items-center justify-center min-h-[400px] ${className} `}>
      </div><Animated />
        <Card className={`p-8 max-w-md w-full text-center ${errorConfig.bgColor} ${errorConfig.borderColor} border-2`} />
          <div className="{/* Ícone */}">$2</div>
            <div className={`flex justify-center ${errorConfig.color} `}>
           
        </div>{errorConfig.icon}
            </div>

            {/* Título */}
            <div>
           
        </div><h2 className={`text-xl font-semibold ${errorConfig.color} mb-2`} />
                {finalTitle}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed" />
                {finalMessage}
              </p>
            </div>

            {/* Detalhes (se fornecidos) */}
            {details && (
              <div className=" ">$2</div><h4 className="text-sm font-medium text-gray-700 mb-2">Detalhes do Erro:</h4>
                <p className="text-xs text-gray-600 font-mono break-all" />
                  {details}
                </p>
      </div>
    </>
  )}

            {/* Ações */}
            <div className="{showRetry && (">$2</div>
                <Button
                  onClick={ handleRetry }
                  variant="default"
                  className="flex items-center gap-2" />
                  <RefreshCw className="w-4 h-4" />
                  Tentar Novamente
                </Button>
              )}
              
              {showGoHome && (
                <Button
                  onClick={ handleGoHome }
                  variant="outline"
                  className="flex items-center gap-2" />
                  <Home className="w-4 h-4" />
                  Ir para Home
                </Button>
              )}
              
              {showReportBug && (
                <Button
                  onClick={ handleReportBug }
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800" />
                  <Bug className="w-4 h-4" />
                  Reportar Bug
                </Button>
              )}
            </div>

            {/* Informações adicionais */}
            <div className=" ">$2</div><p>Se o problema persistir, entre em contato com o suporte.</p>
              <p>ID do Erro: {Date.now().toString(36)}</p></div></Card></Animated></div>);};

// =========================================
// COMPONENTES ESPECIALIZADOS
// =========================================

export const NetworkErrorState: React.FC<Omit<ErrorStateProps, 'type'>> = (props: unknown) => (
  <SocialBufferErrorState {...props} type="network" / />);

export const ServerErrorState: React.FC<Omit<ErrorStateProps, 'type'>> = (props: unknown) => (
  <SocialBufferErrorState {...props} type="server" / />);

export const PermissionErrorState: React.FC<Omit<ErrorStateProps, 'type'>> = (props: unknown) => (
  <SocialBufferErrorState {...props} type="permission" / />);

export const TimeoutErrorState: React.FC<Omit<ErrorStateProps, 'type'>> = (props: unknown) => (
  <SocialBufferErrorState {...props} type="timeout" / />);

export const ValidationErrorState: React.FC<Omit<ErrorStateProps, 'type'>> = (props: unknown) => (
  <SocialBufferErrorState {...props} type="validation" / />);

export const UnknownErrorState: React.FC<Omit<ErrorStateProps, 'type'>> = (props: unknown) => (
  <SocialBufferErrorState {...props} type="any" / />);

// =========================================
// HOOK PARA DETECTAR TIPO DE ERRO
// =========================================

export const useErrorType = (error: unknown): string => {
  if (!error) return 'any';
  
  // Verificar se é um erro de rede
  if (error.code === 'NETWORK_ERROR' || (error as any).message?.includes('network')) {
    return 'network';
  }
  
  // Verificar se é um erro de servidor
  if (error.status >= 500 || (error as any).message?.includes('server')) {
    return 'server';
  }
  
  // Verificar se é um erro de permissão
  if (error.status === 403 || (error as any).message?.includes('permission')) {
    return 'permission';
  }
  
  // Verificar se é um erro de timeout
  if (error.code === 'TIMEOUT' || (error as any).message?.includes('timeout')) {
    return 'timeout';
  }
  
  // Verificar se é um erro de validação
  if (error.status === 400 || (error as any).message?.includes('validation')) {
    return 'validation';
  }
  
  return 'any';};

export default SocialBufferErrorState;
