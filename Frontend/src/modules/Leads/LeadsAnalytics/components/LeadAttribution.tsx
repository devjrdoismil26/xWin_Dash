import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Target, RefreshCw, Download, Filter, Calendar } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { LeadAttribution } from '@/types';

interface LeadAttributionProps {
  leadId?: string;
  onAttributionUpdate??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const LeadAttribution: React.FC<LeadAttributionProps> = ({ leadId, 
  onAttributionUpdate 
   }) => {
  const {
    attribution,
    loading,
    error,
    getAttribution,
    updateAttribution
  } = useLeadAttribution(leadId);

  const [selectedModel, setSelectedModel] = useState<'first_touch' | 'last_touch' | 'linear' | 'time_decay'>('last_touch');

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const handleModelChange = async (model: string) => {
    setSelectedModel(model as 'first_touch' | 'last_touch' | 'linear' | 'time_decay');

    if (leadId) {
      const result = await updateAttribution(leadId, { model });

      if (result) {
        onAttributionUpdate?.(result);

      } };

  const getModelName = (model: string) => {
    const models: { [key: string]: string } = {
      first_touch: 'Primeiro Toque',
      last_touch: 'Último Toque',
      linear: 'Linear',
      time_decay: 'Decaimento Temporal'};

    return models[model] || model;};

  const getModelDescription = (model: string) => {
    const descriptions: { [key: string]: string } = {
      first_touch: '100% do crédito para o primeiro canal de contato',
      last_touch: '100% do crédito para o último canal de contato',
      linear: 'Crédito distribuído igualmente entre todos os canais',
      time_decay: 'Mais crédito para canais mais recentes'};

    return descriptions[model] || '';};

  const getChannelColor = (channel: string) => {
    const colors: { [key: string]: string } = {
      organic_search: 'bg-green-500',
      paid_search: 'bg-blue-500',
      social_media: 'bg-purple-500',
      email: 'bg-yellow-500',
      direct: 'bg-gray-500',
      referral: 'bg-indigo-500',
      display: 'bg-pink-500',
      other: 'bg-orange-500'};

    return colors[channel] || 'bg-gray-400';};

  const getChannelName = (channel: string) => {
    const names: { [key: string]: string } = {
      organic_search: 'Busca Orgânica',
      paid_search: 'Busca Paga',
      social_media: 'Redes Sociais',
      email: 'Email',
      direct: 'Direto',
      referral: 'Indicação',
      display: 'Display',
      other: 'Outros'};

    return names[channel] || channel;};

  if (loading && !attribution) {
    return (
              <div className=" ">$2</div><div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Carregando atribuição...</span>
        </div>);

  }

  return (
            <div className="{/* Header */}">$2</div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-6 h-6 text-blue-600" />
            <div>
           
        </div><h3 className="text-lg font-semibold text-gray-900" />
                Atribuição de Conversão
              </h3>
              <p className="text-sm text-gray-500" />
                Análise de canais que contribuíram para a conversão
              </p></div><div className=" ">$2</div><select
              value={ dateRange }
              onChange={ (e: unknown) => setDateRange(e.target.value as '7d' | '30d' | '90d' | '1y') }
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option></select><button className="p-2 text-gray-400 hover:text-gray-600" />
              <Download className="w-4 h-4" /></button></div>
      </div>

      {/* Content */}
      <div className="{!attribution ? (">$2</div>
          <div className=" ">$2</div><BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2" />
              Nenhum dado de atribuição
            </h4>
            <p className="text-gray-500" />
              Dados de atribuição serão exibidos quando disponíveis
            </p>
      </div>
    </>
  ) : (
          <div className="{/* Model Selection */}">$2</div>
            <div className=" ">$2</div><h4 className="text-sm font-medium text-gray-900 mb-3" />
                Modelo de Atribuição
              </h4>
              <div className="{['first_touch', 'last_touch', 'linear', 'time_decay'].map((model: unknown) => (">$2</div>
                  <button
                    key={ model }
                    onClick={ () => handleModelChange(model) }
                    className={`p-3 text-left rounded-md border transition-colors ${
                      selectedModel === model
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } `}
  >
                    <div className=" ">$2</div><Target className="w-4 h-4 text-blue-600" />
                      <span className="{getModelName(model)}">$2</span>
                      </span></div><p className="text-xs text-gray-600" />
                      {getModelDescription(model)}
                    </p>
      </button>
    </>
  ))}
              </div>

            {/* Attribution Summary */}
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="Total de Conversões">$2</span>
                  </span></div><p className="text-2xl font-bold text-blue-900" />
                  {attribution.total_conversions || 0}
                </p></div><div className=" ">$2</div><div className=" ">$2</div><BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="Canais Ativos">$2</span>
                  </span></div><p className="text-2xl font-bold text-green-900" />
                  {attribution.channels?.length || 0}
                </p></div><div className=" ">$2</div><div className=" ">$2</div><PieChart className="w-5 h-5 text-purple-600" />
                  <span className="Tempo Médio">$2</span>
                  </span></div><p className="text-2xl font-bold text-purple-900" />
                  {attribution.average_time_to_conversion || 0}d
                </p>
              </div>

            {/* Channel Performance */}
            {attribution.channels && attribution.channels.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Performance por Canal
                </h4>
                <div className="{(attribution.channels || []).map((channel: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div className={`w-3 h-3 rounded-full ${getChannelColor(channel.name)} `} />
           
        </div><div>
           
        </div><p className="text-sm font-medium text-gray-900" />
                            {getChannelName(channel.name)}
                          </p>
                          <p className="text-xs text-gray-500" />
                            {channel.touchpoints} toques
                          </p></div><div className=" ">$2</div><p className="text-sm font-bold text-gray-900" />
                          {channel.attribution_percentage}%
                        </p>
                        <p className="text-xs text-gray-500" />
                          {channel.conversions} conversões
                        </p>
      </div>
    </>
  ))}
                </div>
            )}

            {/* Touchpoint Timeline */}
            {attribution.touchpoints && attribution.touchpoints.length > 0 && (
              <div>
           
        </div><h4 className="text-sm font-medium text-gray-900 mb-4" />
                  Timeline de Toques
                </h4>
                <div className="{(attribution.touchpoints || []).map((touchpoint: unknown, index: unknown) => (">$2</div>
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
           
        </div><div className=" ">$2</div><div className={`w-8 h-8 rounded-full ${getChannelColor(touchpoint.channel)} flex items-center justify-center`}>
           
        </div><span className="{index + 1}">$2</span>
                          </span></div><div className=" ">$2</div><p className="text-sm font-medium text-gray-900" />
                          {getChannelName(touchpoint.channel)}
                        </p>
                        <p className="text-xs text-gray-500" />
                          {new Date(touchpoint.timestamp).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p></div><div className=" ">$2</div><p className="text-sm font-bold text-gray-900" />
                          {touchpoint.attribution_percentage}%
                        </p>
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
      </div>);};

export default LeadAttribution;
