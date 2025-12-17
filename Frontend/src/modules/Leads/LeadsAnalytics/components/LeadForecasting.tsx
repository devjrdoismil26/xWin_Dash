import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, BarChart3, RefreshCw, Download, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { LeadForecast } from '@/types';

interface LeadForecastingProps {
  onForecastUpdate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const LeadForecasting: React.FC<LeadForecastingProps> = ({ onForecastUpdate    }) => {
  const {
    forecast,
    loading,
    error,
    getForecasting
  } = useLeadForecasting();

  const [selectedPeriod, setSelectedPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('3m');

  const [selectedMetric, setSelectedMetric] = useState<'leads' | 'conversions' | 'revenue'>('leads');

  const getPeriodText = (period: string) => {
    const periods: { [key: string]: string } = {
      '1m': '1 mês',
      '3m': '3 meses',
      '6m': '6 meses',
      '1y': '1 ano'};

    return periods[period] || period;};

  const getMetricText = (metric: string) => {
    const metrics: { [key: string]: string } = {
      leads: 'Leads',
      conversions: 'Conversões',
      revenue: 'Receita'};

    return metrics[metric] || metric;};

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    } else if (trend < 0) {
      return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
    } else {
      return <Target className="w-4 h-4 text-gray-600" />;
    } ;

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';};

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();};

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);};

  if (loading && !forecast) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando previsões...</span>
        </div>);

  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Calendar className="w-6 h-6 text-blue-600" />
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900" />
                Previsão de Leads
              </h3>
              <p className="text-sm text-gray-500" />
                Projeções baseadas em dados históricos
              </p></div><div className=" ">$2</div><select
              value={ selectedPeriod }
              onChange={ (e: unknown) => setSelectedPeriod(e.target.value as '1m' | '3m' | '6m' | '1y') }
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1m">1 mês</option>
              <option value="3m">3 meses</option>
              <option value="6m">6 meses</option>
              <option value="1y">1 ano</option></select><button className="p-2 text-gray-400 hover:text-gray-600" />
              <Download className="w-4 h-4" /></button></div>
      </div>

      {/* Content */}
      <div className="{!forecast ? (">$2</div>
          <div className=" ">$2</div><BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2" />
              Nenhuma previsão disponível
            </h4>
            <p className="text-gray-500" />
              Previsões serão geradas com base nos dados históricos
            </p>
      </div>
    </>
  ) : (
          <div className="{/* Forecast Summary */}">$2</div>
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Target className="w-5 h-5 text-blue-600" />
                  <span className="Previsão de Leads">$2</span>
                  </span></div><p className="text-2xl font-bold text-blue-900" />
                  {formatNumber(forecast.predicted_leads || 0)}
                </p>
                <div className="{getTrendIcon(forecast.leads_trend || 0)}">$2</div>
                  <span className={`text-xs ${getTrendColor(forecast.leads_trend || 0)} `}>
           
        </span>{Math.abs(forecast.leads_trend || 0)}% vs período anterior
                  </span></div><div className=" ">$2</div><div className=" ">$2</div><CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="Previsão de Conversões">$2</span>
                  </span></div><p className="text-2xl font-bold text-green-900" />
                  {formatNumber(forecast.predicted_conversions || 0)}
                </p>
                <div className="{getTrendIcon(forecast.conversions_trend || 0)}">$2</div>
                  <span className={`text-xs ${getTrendColor(forecast.conversions_trend || 0)} `}>
           
        </span>{Math.abs(forecast.conversions_trend || 0)}% vs período anterior
                  </span></div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="Previsão de Receita">$2</span>
                  </span></div><p className="text-2xl font-bold text-purple-900" />
                  {formatCurrency(forecast.predicted_revenue || 0)}
                </p>
                <div className="{getTrendIcon(forecast.revenue_trend || 0)}">$2</div>
                  <span className={`text-xs ${getTrendColor(forecast.revenue_trend || 0)} `}>
           
        </span>{Math.abs(forecast.revenue_trend || 0)}% vs período anterior
                  </span></div></div>

            {/* Confidence Level */}
            <div className=" ">$2</div><div className=" ">$2</div><AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="Nível de Confiança">$2</span>
                </span></div><p className="text-sm text-yellow-800" />
                {forecast.confidence_level || 85}% de confiança baseado em {forecast.data_points || 0} pontos de dados históricos
              </p>
            </div>

            {/* Monthly Forecast */}
            {forecast.monthly_forecast && forecast.monthly_forecast.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Previsão Mensal
                </h4>
                <div className="{(forecast.monthly_forecast || []).map((month: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><div>
           
        </div><p className="text-sm font-medium text-gray-900" />
                          {new Date(month.month).toLocaleDateString('pt-BR', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-xs text-gray-500" />
                          Confiança: {month.confidence}%
                        </p></div><div className=" ">$2</div><p className="text-sm font-bold text-gray-900" />
                          {formatNumber(month.predicted_leads)}
                        </p>
                        <p className="text-xs text-gray-500" />
                          leads previstos
                        </p>
      </div>
    </>
  ))}
                </div>
            )}

            {/* Key Factors */}
            {forecast.key_factors && forecast.key_factors.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Fatores-Chave
                </h4>
                <div className="{(forecast.key_factors || []).map((factor: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
           
        </div><div className={`w-2 h-2 rounded-full ${
                        factor.impact > 0 ? 'bg-green-500' : 'bg-red-500'
                      } `} />
                      <div className=" ">$2</div><p className="text-sm text-gray-900" />
                          {factor.description}
                        </p></div><div className=" ">$2</div><p className={`text-sm font-medium ${
                          factor.impact > 0 ? 'text-green-600' : 'text-red-600'
                        } `}>
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </p>
      </div>
    </>
  ))}
                </div>
            )}

            {/* Recommendations */}
            {forecast.recommendations && forecast.recommendations.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Recomendações
                </h4>
                <div className="{(forecast.recommendations || []).map((recommendation: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
           
        </div><p className="text-sm text-blue-900" />
                        <strong>{recommendation.title}:</strong> {recommendation.description}
                      </p>
                      {recommendation.expected_impact && (
                        <p className="text-xs text-blue-700 mt-1" />
                          Impacto esperado: {recommendation.expected_impact}
                        </p>
                      )}
                    </div>
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
      </div>);};

export default LeadForecasting;
