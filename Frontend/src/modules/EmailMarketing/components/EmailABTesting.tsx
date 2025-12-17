import React, { useState } from 'react';
import { TestTube, Plus, Edit, Trash2, Play, Pause, RefreshCw, TrendingUp, BarChart3, Target, Clock, Users, Eye, Settings, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useEmailABTesting } from '../hooks/useEmailMarketingAdvanced';
import { EmailABTest } from '../types/emailTypes';

interface EmailABTestingProps {
  onTestSelect??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const EmailABTesting: React.FC<EmailABTestingProps> = ({ onTestSelect    }) => {
  const {
    tests,
    loading,
    error,
    getTests,
    createTest,
    updateTest,
    deleteTest,
    startTest,
    stopTest
  } = useEmailABTesting();

  const [showForm, setShowForm] = useState(false);

  const [editingTest, setEditingTest] = useState<EmailABTest | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    campaign_id: '',
    test_type: 'subject',
    traffic_split: 50,
    winner_criteria: 'open_rate'
  });

  const handleCreateTest = async () => {
    const result = await createTest(formData);

    if (result) {
      setShowForm(false);

      resetForm();

    } ;

  const handleUpdateTest = async () => {
    if (!editingTest) return;
    
    const result = await updateTest(editingTest.id, formData);

    if (result) {
      setEditingTest(null);

      setShowForm(false);

      resetForm();

    } ;

  const handleDeleteTest = async (testId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este teste A/B?')) {
      await deleteTest(testId);

    } ;

  const handleEditTest = (test: EmailABTest) => {
    setEditingTest(test);

    setFormData({
      name: test.name,
      description: test.description,
      campaign_id: test.campaign_id,
      test_type: test.test_type,
      traffic_split: test.traffic_split,
      winner_criteria: test.winner_criteria
    });

    setShowForm(true);};

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      campaign_id: '',
      test_type: 'subject',
      traffic_split: 50,
      winner_criteria: 'open_rate'
    });};

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      running: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800'};

    return colors[status] || colors.draft;};

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    } ;

  const getTestTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      subject: 'Assunto',
      content: 'Conteúdo',
      send_time: 'Horário de Envio',
      from_name: 'Nome do Remetente'};

    return types[type] || type;};

  const getWinnerCriteriaName = (criteria: string) => {
    const criteriaMap: { [key: string]: string } = {
      open_rate: 'Taxa de Abertura',
      click_rate: 'Taxa de Clique',
      conversion_rate: 'Taxa de Conversão',
      revenue: 'Receita'};

    return criteriaMap[criteria] || criteria;};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();};

  if (loading && tests.length === 0) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando testes A/B...</span>
        </div>);

  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TestTube className="w-6 h-6 text-blue-600" />
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900" />
                Testes A/B
              </h3>
              <p className="text-sm text-gray-500" />
                {tests.length} testes configurados
              </p></div><div className=" ">$2</div><button
              onClick={ getTests }
              disabled={ loading }
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50" />
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''} `} / /></button><button
              onClick={() => {
                setShowForm(true);

                setEditingTest(null);

                resetForm();

              } className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Teste
            </button></div></div>

      {/* Content */}
      <div className="{tests.length === 0 ? (">$2</div>
          <div className=" ">$2</div><TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2" />
              Nenhum teste A/B configurado
            </h4>
            <p className="text-gray-500 mb-4" />
              Crie testes A/B para otimizar suas campanhas de email
            </p>
            <button
              onClick={ () => setShowForm(true) }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Criar Primeiro Teste
            </button>
      </div>
    </>
  ) : (
          <div className="{(tests || []).map((test: unknown) => (">$2</div>
              <div
                key={ test.id }
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h4 className="text-sm font-medium text-gray-900" />
                        {test.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)} `}>
           
        </span>{test.status}
                      </span>
                      {getStatusIcon(test.status)}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3" />
                      {test.description}
                    </p>

                    <div className=" ">$2</div><div>
           
        </div><span className="text-gray-500">Tipo:</span>
                        <p className="font-medium text-gray-900" />
                          {getTestTypeName(test.test_type)}
                        </p></div><div>
           
        </div><span className="text-gray-500">Divisão:</span>
                        <p className="font-medium text-gray-900" />
                          {test.traffic_split}%
                        </p></div><div>
           
        </div><span className="text-gray-500">Critério:</span>
                        <p className="font-medium text-gray-900" />
                          {getWinnerCriteriaName(test.winner_criteria)}
                        </p></div><div>
           
        </div><span className="text-gray-500">Variantes:</span>
                        <p className="font-medium text-gray-900" />
                          {test.variants.length}
                        </p>
                      </div>

                    {/* Variants */}
                    <div className=" ">$2</div><h5 className="text-xs font-medium text-gray-700" />
                        Variantes:
                      </h5>
                      {(test.variants || []).map((variant: unknown, index: unknown) => (
                        <div key={variant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
           
        </div><div className=" ">$2</div><div className="{index + 1}">$2</div>
                            </div>
                            <span className="text-xs text-gray-900">{variant.name}</span></div><div className=" ">$2</div><span>{variant.traffic_percentage}%</span>
                            <span>{variant.metrics.sent} enviados</span>
                            <span>{variant.metrics.opened} abertos</span>
      </div>
    </>
  ))}
                    </div>

                    {/* Results */}
                    {test.results && (
                      <div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="Teste Concluído">$2</span>
                          </span></div><div className=" ">$2</div><div>
           
        </div><span className="text-green-700">Vencedor:</span>
                            <p className="font-medium text-green-900" />
                              Variante {test.results.winner_variant_id}
                            </p></div><div>
           
        </div><span className="text-green-700">Melhoria:</span>
                            <p className="font-medium text-green-900" />
                              +{test.results.improvement_percentage.toFixed(1)}%
                            </p></div></div>
                    )}

                    {/* Dates */}
                    <div className=" ">$2</div><span>Início: {formatDate(test.start_date)}</span>
                      {test.end_date && (
                        <span>Fim: {formatDate(test.end_date)}</span>
                      )}
                    </div>

                  <div className="{test.status === 'running' ? (">$2</div>
                      <button
                        onClick={ () => stopTest(test.id) }
                        className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-md"
                        title="Pausar teste"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : test.status === 'draft' ? (
                      <button
                        onClick={ () => startTest(test.id) }
                        className="p-2 text-green-600 hover:bg-green-100 rounded-md"
                        title="Iniciar teste"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    ) : null}
                    <button
                      onClick={ () => handleEditTest(test) }
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" /></button><button
                      onClick={ () => handleDeleteTest(test.id) }
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" /></button></div>
    </div>
  ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className=" ">$2</div><p className="text-sm text-red-700">{error}</p>
      </div>
    </>
  )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h4 className="text-lg font-semibold text-gray-900" />
                {editingTest ? 'Editar Teste A/B' : 'Novo Teste A/B'}
              </h4>
              <button
                onClick={() => {
                  setShowForm(false);

                  setEditingTest(null);

                  resetForm();

                } className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" /></button></div>

            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  Nome do Teste
                </label>
                <input
                  type="text"
                  value={ formData.name }
                  onChange={(e: unknown) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Teste de Assunto - Black Friday" /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  Descrição
                </label>
                <textarea
                  value={ formData.description }
                  onChange={(e: unknown) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={ 3 }
                  placeholder="Descreva o teste..." /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  ID da Campanha
                </label>
                <input
                  type="text"
                  value={ formData.campaign_id }
                  onChange={(e: unknown) => setFormData({ ...formData, campaign_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ID da campanha" /></div><div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    Tipo de Teste
                  </label>
                  <select
                    value={ formData.test_type }
                    onChange={(e: unknown) => setFormData({ ...formData, test_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="subject">Assunto</option>
                    <option value="content">Conteúdo</option>
                    <option value="send_time">Horário de Envio</option>
                    <option value="from_name">Nome do Remetente</option></select></div>

                <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                    Divisão de Tráfego (%)
                  </label>
                  <input
                    type="number"
                    value={ formData.traffic_split }
                    onChange={(e: unknown) => setFormData({ ...formData, traffic_split: parseInt(e.target.value) || 50 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="10"
                    max="90" /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-1" />
                  Critério de Vitória
                </label>
                <select
                  value={ formData.winner_criteria }
                  onChange={(e: unknown) => setFormData({ ...formData, winner_criteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open_rate">Taxa de Abertura</option>
                  <option value="click_rate">Taxa de Clique</option>
                  <option value="conversion_rate">Taxa de Conversão</option>
                  <option value="revenue">Receita</option></select></div>

            <div className=" ">$2</div><button
                onClick={() => {
                  setShowForm(false);

                  setEditingTest(null);

                  resetForm();

                } className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={ editingTest ? handleUpdateTest : handleCreateTest }
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" />
                <TestTube className="w-4 h-4 mr-2" />
                {editingTest ? 'Atualizar' : 'Criar'} Teste
              </button></div></div>
      )}
    </div>);};

export default EmailABTesting;
