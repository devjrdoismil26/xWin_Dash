import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, FileText, Lock, Eye, Download, Settings, Globe, Users, Clock, Mail, X } from 'lucide-react';
import { useEmailCompliance } from '../hooks/useEmailMarketingAdvanced';
import { EmailCompliance as EmailComplianceType, EmailComplianceCheck } from '../types/emailTypes';

interface EmailComplianceProps {
  onComplianceUpdate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const EmailCompliance: React.FC<EmailComplianceProps> = ({ onComplianceUpdate    }) => {
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

    } ;

  const getComplianceIcon = (isCompliant: boolean) => {
    return isCompliant ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />);};

  const getComplianceColor = (isCompliant: boolean) => {
    return isCompliant ? 'text-green-600' : 'text-red-600';};

  const getComplianceBgColor = (isCompliant: boolean) => {
    return isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';};

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
    } ;

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
    } ;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  if (loading && !compliance) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando compliance...</span>
        </div>);

  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Shield className="w-6 h-6 text-blue-600" />
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900" />
                Compliance
              </h3>
              <p className="text-sm text-gray-500" />
                Conformidade com regulamentações
              </p></div><div className=" ">$2</div><button
              onClick={ () => setShowCheckModal(true) }
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Verificar
            </button>
            <button
              onClick={ getCompliance }
              disabled={ loading }
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" />
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} `} / /></button></div>
      </div>

      {/* Content */}
      <div className="{!compliance ? (">$2</div>
          <div className=" ">$2</div><Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2" />
              Nenhum dado de compliance
            </h4>
            <p className="text-gray-500" />
              Os dados de compliance serão carregados automaticamente
            </p>
      </div>
    </>
  ) : (
          <div className="{/* Compliance Overview */}">$2</div>
            <div className=" ">$2</div><div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.gdpr_compliant)} `}>
           
        </div><div className=" ">$2</div><div className=" ">$2</div><Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">GDPR</span>
                  </div>
                  {getComplianceIcon(compliance.gdpr_compliant)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.gdpr_compliant)} `} />
                  {compliance.gdpr_compliant ? 'Conforme' : 'Não Conforme'}
                </p></div><div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.can_spam_compliant)} `}>
           
        </div><div className=" ">$2</div><div className=" ">$2</div><Mail className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">CAN-SPAM</span>
                  </div>
                  {getComplianceIcon(compliance.can_spam_compliant)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.can_spam_compliant)} `} />
                  {compliance.can_spam_compliant ? 'Conforme' : 'Não Conforme'}
                </p></div><div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.ccpa_compliant)} `}>
           
        </div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">CCPA</span>
                  </div>
                  {getComplianceIcon(compliance.ccpa_compliant)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.ccpa_compliant)} `} />
                  {compliance.ccpa_compliant ? 'Conforme' : 'Não Conforme'}
                </p></div><div className={`p-4 rounded-lg border ${getComplianceBgColor(compliance.unsubscribe_mechanism)} `}>
           
        </div><div className=" ">$2</div><div className=" ">$2</div><Eye className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-900">Unsubscribe</span>
                  </div>
                  {getComplianceIcon(compliance.unsubscribe_mechanism)}
                </div>
                <p className={`text-sm ${getComplianceColor(compliance.unsubscribe_mechanism)} `} />
                  {compliance.unsubscribe_mechanism ? 'Implementado' : 'Não Implementado'}
                </p>
              </div>

            {/* Policies */}
            <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-3" />
                Políticas e Mecanismos
              </h4>
              <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Política de Privacidade</span>
                  </div>
                  {getComplianceIcon(compliance.privacy_policy)}
                </div>
                <div className=" ">$2</div><div className=" ">$2</div><Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Retenção de Dados</span>
                  </div>
                  {getComplianceIcon(compliance.data_retention_policy)}
                </div>
                <div className=" ">$2</div><div className=" ">$2</div><Lock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">Gestão de Consentimento</span>
                  </div>
                  {getComplianceIcon(compliance.consent_management)}
                </div>
            </div>

            {/* Audit Information */}
            <div className=" ">$2</div><h4 className="text-sm font-medium text-gray-900 mb-3" />
                Informações de Auditoria
              </h4>
              <div className=" ">$2</div><div>
           
        </div><span className="text-gray-500">Última Auditoria:</span>
                  <p className="font-medium text-gray-900" />
                    {formatDate(compliance.last_audit)}
                  </p></div><div>
           
        </div><span className="text-gray-500">Próxima Auditoria:</span>
                  <p className="font-medium text-gray-900" />
                    {formatDate(compliance.next_audit)}
                  </p></div></div>
        )}

        {/* Error Display */}
        {error && (
          <div className=" ">$2</div><p className="text-sm text-red-700">{error}</p>
      </div>
    </>
  )}
      </div>

      {/* Check Modal */}
      {showCheckModal && (
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h4 className="text-lg font-semibold text-gray-900" />
                Verificação de Compliance
              </h4>
              <button
                onClick={() => {
                  setShowCheckModal(false);

                  setCheckResult(null);

                } className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" /></button></div>

            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  Tipo de Verificação
                </label>
                <select
                  value={ checkType }
                  onChange={ (e: unknown) => setCheckType(e.target.value as 'gdpr' | 'can_spam' | 'ccpa' | 'general') }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">Verificação Geral</option>
                  <option value="gdpr">GDPR</option>
                  <option value="can_spam">CAN-SPAM</option>
                  <option value="ccpa">CCPA</option></select></div>

              {checkResult && (
                <div className=" ">$2</div><h5 className="text-sm font-medium text-gray-900 mb-2" />
                    Resultado da Verificação
                  </h5>
                  <div className=" ">$2</div><div className="{getCheckStatusIcon(checkResult.status)}">$2</div>
                      <span className={`text-sm font-medium ${getCheckStatusColor(checkResult.status)} `}>
           
        </span>{checkResult.status === 'pass' ? 'Aprovado' :
                         checkResult.status === 'fail' ? 'Reprovado' : 'Atenção'}
                      </span>
                    </div>
                    {checkResult.issues.length > 0 && (
                      <div>
           
        </div><span className="text-sm text-gray-600">Problemas:</span>
                        <ul className="text-xs text-red-600 mt-1" />
                          {(checkResult.issues || []).map((issue: unknown, index: unknown) => (
                            <li key={ index }>• {issue}</li>
                          ))}
                        </ul>
      </div>
    </>
  )}
                    {checkResult.recommendations.length > 0 && (
                      <div>
           
        </div><span className="text-sm text-gray-600">Recomendações:</span>
                        <ul className="text-xs text-blue-600 mt-1" />
                          {(checkResult.recommendations || []).map((rec: unknown, index: unknown) => (
                            <li key={ index }>• {rec}</li>
                          ))}
                        </ul>
      </div>
    </>
  )}
                  </div>
              )}
            </div>

            <div className=" ">$2</div><button
                onClick={() => {
                  setShowCheckModal(false);

                  setCheckResult(null);

                } className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fechar
              </button>
              <button
                onClick={ handleCheckCompliance }
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" />
                <FileText className="w-4 h-4 mr-2" />
                Executar Verificação
              </button></div></div>
      )}
    </div>);};

export default EmailCompliance;
