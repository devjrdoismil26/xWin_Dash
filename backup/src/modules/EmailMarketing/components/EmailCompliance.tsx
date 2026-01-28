import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  FileText,
  Lock,
  Eye,
  Download,
  Settings,
  Globe,
  Users,
  Clock,
  Mail,
  X
} from 'lucide-react';
import { useEmailCompliance } from '../hooks/useEmailMarketingAdvanced';
import { EmailCompliance as EmailComplianceType, EmailComplianceCheck } from '../types/emailTypes';

interface EmailComplianceProps {
  onComplianceUpdate?: (compliance: EmailComplianceType) => void;
}

const EmailCompliance: React.FC<EmailComplianceProps> = ({ onComplianceUpdate }) => {
  const {
    compliance,
    loading,
    error,
    getCompliance,
    checkCompliance
  } = useEmailCompliance();

  const [showCheckModal, setShowCheckModal] = useState(false);
  const [checkType, setCheckType] = useState<'gdpr' | 'can_spam' | 'ccpa' | 'general'>('general');
  const [checkResult, setCheckResult] = useState<EmailComplianceCheck | null>(null);

  const handleCheckCompliance = async () => {
    const result = await checkCompliance(checkType);
    if (result) {
      setCheckResult(result);
    }
  };

  const getComplianceIcon = (isCompliant: boolean) => {
    return isCompliant ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getComplianceColor = (isCompliant: boolean) => {
    return isCompliant ? 'text-green-600' : 'text-red-600';
  };

  const getComplianceBgColor = (isCompliant: boolean) => {
    return isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const getCheckStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCheckStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600';
      case 'fail':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !compliance) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando compliance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Compliance
              </h3>
              <p className="text-sm text-gray-500">
                Conformidade com regulamentações
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCheckModal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Verificar
            </button>
            <button
              onClick={getCompliance}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {!compliance ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum dado de compliance
            </h4>
            <p className="text-gray-500">
              Os dados de compliance serão carregados automaticamente
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.gdpr_compliant)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">GDPR</span>
                  </div>
                  {getComplianceIcon(compliance.gdpr_compliant)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.gdpr_compliant)}`}>
                  {compliance.gdpr_compliant ? 'Conforme' : 'Não Conforme'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.can_spam_compliant)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">CAN-SPAM</span>
                  </div>
                  {getComplianceIcon(compliance.can_spam_compliant)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.can_spam_compliant)}`}>
                  {compliance.can_spam_compliant ? 'Conforme' : 'Não Conforme'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.ccpa_compliant)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">CCPA</span>
                  </div>
                  {getComplianceIcon(compliance.ccpa_compliant)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.ccpa_compliant)}`}>
                  {compliance.ccpa_compliant ? 'Conforme' : 'Não Conforme'}
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.unsubscribe_mechanism)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">Unsubscribe</span>
                  </div>
                  {getComplianceIcon(compliance.unsubscribe_mechanism)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.unsubscribe_mechanism)}`}>
                  {compliance.unsubscribe_mechanism ? 'Implementado' : 'Não Implementado'}
                </p>
              </div>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Políticas e Mecanismos
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Política de Privacidade</span>
                  </div>
                  {getComplianceIcon(compliance.privacy_policy)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Retenção de Dados</span>
                  </div>
                  {getComplianceIcon(compliance.data_retention_policy)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Gestão de Consentimento</span>
                  </div>
                  {getComplianceIcon(compliance.consent_management)}
                </div>
              </div>
            </div>

            {/* Audit Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Informações de Auditoria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Última Auditoria:</span>
                  <p className="font-medium text-gray-900">
                    {formatDate(compliance.last_audit)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Próxima Auditoria:</span>
                  <p className="font-medium text-gray-900">
                    {formatDate(compliance.next_audit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Check Modal */}
      {showCheckModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Verificação de Compliance
              </h4>
              <button
                onClick={() => {
                  setShowCheckModal(false);
                  setCheckResult(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Verificação
                </label>
                <select
                  value={checkType}
                  onChange={(e) => setCheckType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Verificação Geral</option>
                  <option value="gdpr">GDPR</option>
                  <option value="can_spam">CAN-SPAM</option>
                  <option value="ccpa">CCPA</option>
                </select>
              </div>

              {checkResult && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Resultado da Verificação
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getCheckStatusIcon(checkResult.status)}
                      <span className={`text-sm font-medium ${getCheckStatusColor(checkResult.status)}`}>
                        {checkResult.status === 'pass' ? 'Aprovado' :
                         checkResult.status === 'fail' ? 'Reprovado' : 'Atenção'}
                      </span>
                    </div>
                    {checkResult.issues.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Problemas:</span>
                        <ul className="text-xs text-red-600 mt-1">
                          {checkResult.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {checkResult.recommendations.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Recomendações:</span>
                        <ul className="text-xs text-blue-600 mt-1">
                          {checkResult.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCheckModal(false);
                  setCheckResult(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fechar
              </button>
              <button
                onClick={handleCheckCompliance}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Executar Verificação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCompliance;
