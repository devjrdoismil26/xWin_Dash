import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, RefreshCw, TestTube, TrendingUp, TrendingDown, Globe, Lock, Mail, BarChart3, Download, Settings, X } from 'lucide-react';
import { useEmailDeliverability } from '../hooks/useEmailMarketingAdvanced';
import { EmailDeliverability as EmailDeliverabilityType, EmailDeliverabilityTest } from '../types/emailTypes';

interface EmailDeliverabilityProps {
  onDeliverabilityUpdate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const EmailDeliverability: React.FC<EmailDeliverabilityProps> = ({ onDeliverabilityUpdate    }) => {
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

    } ;

  const getReputationColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';};

  const getReputationIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;};

  const getReputationText = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Ruim';};

  const getAuthIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />);};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  if (loading && !deliverability) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando deliverability...</span>
        </div>);

  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Shield className="w-6 h-6 text-blue-600" />
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900" />
                Deliverability
              </h3>
              <p className="text-sm text-gray-500" />
                Monitoramento de reputação e autenticação
              </p></div><div className=" ">$2</div><button
              onClick={ () => setShowTestModal(true) }
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Testar
            </button>
            <button
              onClick={ getDeliverability }
              disabled={ loading }
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" />
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} `} / /></button></div>
      </div>

      {/* Content */}
      <div className="{!deliverability ? (">$2</div>
          <div className=" ">$2</div><Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2" />
              Nenhum dado de deliverability
            </h4>
            <p className="text-gray-500" />
              Os dados de deliverability serão carregados automaticamente
            </p>
      </div>
    </>
  ) : (
          <div className="{/* Reputation Overview */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><h4 className="text-sm font-medium text-gray-900" />
                  Reputação do Domínio
                </h4>
                <div className="{getReputationIcon(deliverability.reputation_score)}">$2</div>
                  <span className={`text-sm font-bold ${getReputationColor(deliverability.reputation_score)} `}>
           
        </span>{deliverability.reputation_score}/100
                  </span></div><div className=" ">$2</div><div className=" ">$2</div><p className="text-2xl font-bold text-gray-900" />
                    {deliverability.domain}
                  </p>
                  <p className="text-xs text-gray-500">Domínio</p></div><div className=" ">$2</div><p className={`text-2xl font-bold ${getReputationColor(deliverability.reputation_score)} `} />
                    {getReputationText(deliverability.reputation_score)}
                  </p>
                  <p className="text-xs text-gray-500">Status</p></div><div className=" ">$2</div><p className="text-2xl font-bold text-gray-900" />
                    {formatDate(deliverability.last_checked)}
                  </p>
                  <p className="text-xs text-gray-500">Última Verificação</p></div></div>

            {/* Metrics */}
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TrendingDown className="w-5 h-5 text-red-600" />
                  <span className="Taxa de Bounce">$2</span>
                  </span></div><p className="text-2xl font-bold text-red-900" />
                  {deliverability.bounce_rate.toFixed(2)}%
                </p></div><div className=" ">$2</div><div className=" ">$2</div><AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="Taxa de Reclamação">$2</span>
                  </span></div><p className="text-2xl font-bold text-yellow-900" />
                  {deliverability.complaint_rate.toFixed(2)}%
                </p></div><div className=" ">$2</div><div className=" ">$2</div><Mail className="w-5 h-5 text-orange-600" />
                  <span className="Taxa de Spam">$2</span>
                  </span></div><p className="text-2xl font-bold text-orange-900" />
                  {deliverability.spam_rate.toFixed(2)}%
                </p>
              </div>

            {/* Authentication */}
            <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-3" />
                Autenticação
              </h4>
              <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">SPF</span>
                  </div>
                  {getAuthIcon(deliverability.authentication.spf)}
                </div>
                <div className=" ">$2</div><div className=" ">$2</div><Lock className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">DKIM</span>
                  </div>
                  {getAuthIcon(deliverability.authentication.dkim)}
                </div>
                <div className=" ">$2</div><div className=" ">$2</div><Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700">DMARC</span>
                  </div>
                  {getAuthIcon(deliverability.authentication.dmarc)}
                </div>
            </div>

            {/* Blacklists */}
            {deliverability.blacklists.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-3" />
                  Blacklists
                </h4>
                <div className=" ">$2</div><div className=" ">$2</div><XCircle className="w-4 h-4 text-red-600" />
                    <span className="Domínio listado em {deliverability.blacklists.length} blacklist(s)">$2</span>
                    </span></div><div className="{(deliverability.blacklists || []).map((blacklist: unknown, index: unknown) => (">$2</div>
                      <p key={index} className="text-xs text-red-700" />
                        • {blacklist}
                      </p>
                    ))}
                  </div>
    </div>
  )}

            {/* Recommendations */}
            {deliverability.recommendations.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-3" />
                  Recomendações
                </h4>
                <div className="{(deliverability.recommendations || []).map((recommendation: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
           
        </div><TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900">{recommendation}</p>
      </div>
    </>
  ))}
                </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className=" ">$2</div><p className="text-sm text-red-700">{error}</p>
      </div>
    </>
  )}
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h4 className="text-lg font-semibold text-gray-900" />
                Teste de Deliverability
              </h4>
              <button
                onClick={() => {
                  setShowTestModal(false);

                  setTestResult(null);

                } className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" /></button></div>

            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  Tipo de Teste
                </label>
                <select
                  value={ testType }
                  onChange={ (e: unknown) => setTestType(e.target.value as 'spam_check' | 'authentication' | 'reputation' | 'content') }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="spam_check">Verificação de Spam</option>
                  <option value="authentication">Autenticação</option>
                  <option value="reputation">Reputação</option>
                  <option value="content">Conteúdo</option></select></div>

              <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  Conteúdo do Email
                </label>
                <textarea
                  value={ testContent }
                  onChange={ (e: unknown) => setTestContent(e.target.value) }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={ 4 }
                  placeholder="Cole o conteúdo do email aqui..." />
              </div>

              {testResult && (
                <div className=" ">$2</div><h5 className="text-sm font-medium text-gray-900 mb-2" />
                    Resultado do Teste
                  </h5>
                  <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm text-gray-600">Score:</span>
                      <span className={`text-sm font-bold ${
                        testResult.test_results.score >= 80 ? 'text-green-600' :
                        testResult.test_results.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      } `}>
                        {testResult.test_results.score}/100
                      </span>
                    </div>
                    {testResult.test_results.issues.length > 0 && (
                      <div>
           
        </div><span className="text-sm text-gray-600">Problemas:</span>
                        <ul className="text-xs text-red-600 mt-1" />
                          {(testResult.test_results.issues || []).map((issue: unknown, index: unknown) => (
                            <li key={ index }>• {issue}</li>
                          ))}
                        </ul>
      </div>
    </>
  )}
                    {testResult.test_results.recommendations.length > 0 && (
                      <div>
           
        </div><span className="text-sm text-gray-600">Recomendações:</span>
                        <ul className="text-xs text-blue-600 mt-1" />
                          {(testResult.test_results.recommendations || []).map((rec: unknown, index: unknown) => (
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
                  setShowTestModal(false);

                  setTestResult(null);

                } className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fechar
              </button>
              <button
                onClick={ handleTestDeliverability }
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" />
                <TestTube className="w-4 h-4 mr-2" />
                Executar Teste
              </button></div></div>
      )}
    </div>);};

export default EmailDeliverability;
