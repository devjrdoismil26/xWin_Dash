import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  TestTube,
  TrendingUp,
  TrendingDown,
  Globe,
  Lock,
  Mail,
  BarChart3,
  Download,
  Settings,
  X
} from 'lucide-react';
import { useEmailDeliverability } from '../hooks/useEmailMarketingAdvanced';
import { EmailDeliverability as EmailDeliverabilityType, EmailDeliverabilityTest } from '../types/emailTypes';

interface EmailDeliverabilityProps {
  onDeliverabilityUpdate?: (deliverability: EmailDeliverabilityType) => void;
}

const EmailDeliverability: React.FC<EmailDeliverabilityProps> = ({ onDeliverabilityUpdate }) => {
  const {
    deliverability,
    loading,
    error,
    getDeliverability,
    testDeliverability
  } = useEmailDeliverability();

  const [showTestModal, setShowTestModal] = useState(false);
  const [testType, setTestType] = useState<'spam_check' | 'authentication' | 'reputation' | 'content'>('spam_check');
  const [testContent, setTestContent] = useState('');
  const [testResult, setTestResult] = useState<EmailDeliverabilityTest | null>(null);

  const handleTestDeliverability = async () => {
    const result = await testDeliverability({
      test_type: testType,
      email_content: testContent
    });
    if (result) {
      setTestResult(result);
    }
  };

  const getReputationColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getReputationIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getReputationText = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Ruim';
  };

  const getAuthIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
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

  if (loading && !deliverability) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando deliverability...</span>
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
                Deliverability
              </h3>
              <p className="text-sm text-gray-500">
                Monitoramento de reputação e autenticação
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTestModal(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Testar
            </button>
            <button
              onClick={getDeliverability}
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
        {!deliverability ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum dado de deliverability
            </h4>
            <p className="text-gray-500">
              Os dados de deliverability serão carregados automaticamente
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reputation Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Reputação do Domínio
                </h4>
                <div className="flex items-center space-x-2">
                  {getReputationIcon(deliverability.reputation_score)}
                  <span className={`text-sm font-bold ${getReputationColor(deliverability.reputation_score)}`}>
                    {deliverability.reputation_score}/100
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {deliverability.domain}
                  </p>
                  <p className="text-xs text-gray-500">Domínio</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${getReputationColor(deliverability.reputation_score)}`}>
                    {getReputationText(deliverability.reputation_score)}
                  </p>
                  <p className="text-xs text-gray-500">Status</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatDate(deliverability.last_checked)}
                  </p>
                  <p className="text-xs text-gray-500">Última Verificação</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-900">
                    Taxa de Bounce
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-900">
                  {deliverability.bounce_rate.toFixed(2)}%
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">
                    Taxa de Reclamação
                  </span>
                </div>
                <p className="text-2xl font-bold text-yellow-900">
                  {deliverability.complaint_rate.toFixed(2)}%
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">
                    Taxa de Spam
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-900">
                  {deliverability.spam_rate.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Authentication */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Autenticação
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">SPF</span>
                  </div>
                  {getAuthIcon(deliverability.authentication.spf)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">DKIM</span>
                  </div>
                  {getAuthIcon(deliverability.authentication.dkim)}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">DMARC</span>
                  </div>
                  {getAuthIcon(deliverability.authentication.dmarc)}
                </div>
              </div>
            </div>

            {/* Blacklists */}
            {deliverability.blacklists.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Blacklists
                </h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">
                      Domínio listado em {deliverability.blacklists.length} blacklist(s)
                    </span>
                  </div>
                  <div className="space-y-1">
                    {deliverability.blacklists.map((blacklist, index) => (
                      <p key={index} className="text-xs text-red-700">
                        • {blacklist}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {deliverability.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Recomendações
                </h4>
                <div className="space-y-2">
                  {deliverability.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Teste de Deliverability
              </h4>
              <button
                onClick={() => {
                  setShowTestModal(false);
                  setTestResult(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Teste
                </label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="spam_check">Verificação de Spam</option>
                  <option value="authentication">Autenticação</option>
                  <option value="reputation">Reputação</option>
                  <option value="content">Conteúdo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo do Email
                </label>
                <textarea
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Cole o conteúdo do email aqui..."
                />
              </div>

              {testResult && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">
                    Resultado do Teste
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className={`text-sm font-bold ${
                        testResult.test_results.score >= 80 ? 'text-green-600' :
                        testResult.test_results.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {testResult.test_results.score}/100
                      </span>
                    </div>
                    {testResult.test_results.issues.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Problemas:</span>
                        <ul className="text-xs text-red-600 mt-1">
                          {testResult.test_results.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {testResult.test_results.recommendations.length > 0 && (
                      <div>
                        <span className="text-sm text-gray-600">Recomendações:</span>
                        <ul className="text-xs text-blue-600 mt-1">
                          {testResult.test_results.recommendations.map((rec, index) => (
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
                  setShowTestModal(false);
                  setTestResult(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fechar
              </button>
              <button
                onClick={handleTestDeliverability}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Executar Teste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDeliverability;
