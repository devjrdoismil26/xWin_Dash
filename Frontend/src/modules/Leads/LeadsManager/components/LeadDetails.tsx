import React from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import { LeadDetailsProps, LeadStatus, LeadOrigin } from '../types';
const LeadDetails: React.FC<LeadDetailsProps> = ({ lead, onUpdate, onDelete    }) => {
  const getStatusColor = (status: LeadStatus): string => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-purple-100 text-purple-800',
      negotiation: 'bg-orange-100 text-orange-800',
      won: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-red-100 text-red-800'};

    return colors[status] || 'bg-gray-100 text-gray-800';};

  const getOriginLabel = (origin: LeadOrigin): string => {
    const labels = {
      website: 'Website',
      social_media: 'Redes Sociais',
      email_marketing: 'Email Marketing',
      referral: 'Indicação',
      cold_call: 'Cold Call',
      event: 'Evento',
      partner: 'Parceiro',
      organic_search: 'Busca Orgânica',
      paid_ads: 'Anúncios Pagos',
      other: 'Outro'};

    return labels[origin] || origin;};

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><div>
           
        </div><Card.Title className="text-xl">{lead.name}</Card.Title>
            <p className="text-sm text-gray-600 mt-1">{lead.email}</p></div><div className=" ">$2</div><Button 
              variant="outline" 
              size="sm"
              onClick={ () => onUpdate?.(lead)  }>
              Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={ () => onDelete?.(lead.id) }
              className="text-red-600 hover:text-red-700"
            >
              Excluir
            </Button></div></Card.Header>
      <Card.Content className="space-y-4" />
        {/* Informações Básicas */}
        <div className=" ">$2</div><div>
           
        </div><h4 className="font-medium text-gray-900 mb-2">Informações de Contato</h4>
            <div className="{lead.phone && (">$2</div>
                <div>
           
        </div><span className="font-medium">Telefone:</span> {lead.phone}
                </div>
              )}
              {lead.whatsapp && (
                <div>
           
        </div><span className="font-medium">WhatsApp:</span> {lead.whatsapp}
                </div>
              )}
            </div>
          <div>
           
        </div><h4 className="font-medium text-gray-900 mb-2">Status e Origem</h4>
            <div className=" ">$2</div><div className=" ">$2</div><span className="text-sm font-medium">Status:</span>
                <Badge className={getStatusColor(lead.status) } />
                  {lead.status}
                </Badge></div><div className=" ">$2</div><span className="text-sm font-medium">Origem:</span>
                <span className="{getOriginLabel(lead.origin)}">$2</span>
                </span></div></div>
        {/* Score */}
        <div>
           
        </div><h4 className="font-medium text-gray-900 mb-2">Score</h4>
          <div className=" ">$2</div><div className=" ">$2</div><div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={width: `${lead.score} %` } />
           
        </div><span className="text-sm font-medium">{lead.score}/100</span>
          </div>
        {/* Tags */}
        {lead.tags.length > 0 && (
          <div>
           
        </div><h4 className="font-medium text-gray-900 mb-2">Tags</h4>
            <div className="{(lead.tags || []).map((tag: unknown) => (">$2</div>
                <Badge key={tag.id} variant="secondary" />
                  {tag.name}
                </Badge>
              ))}
            </div>
        )}
        {/* Observações */}
        {lead.notes && (
          <div>
           
        </div><h4 className="font-medium text-gray-900 mb-2">Observações</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded" />
              {lead.notes}
            </p>
      </div>
    </>
  )}
        {/* Campos Personalizados */}
        {Object.keys(lead.custom_fields).length > 0 && (
          <div>
           
        </div><h4 className="font-medium text-gray-900 mb-2">Campos Personalizados</h4>
            <div className="{Object.entries(lead.custom_fields).map(([key, value]) => (">$2</div>
                <div key={key} className="text-sm">
           
        </div><span className="font-medium">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
        )}
        {/* Datas */}
        <div className=" ">$2</div><div>
           
        </div><span className="text-sm font-medium text-gray-900">Criado em:</span>
            <p className="text-sm text-gray-600">{formatDate(lead.created_at)}</p></div><div>
           
        </div><span className="text-sm font-medium text-gray-900">Atualizado em:</span>
            <p className="text-sm text-gray-600">{formatDate(lead.updated_at)}</p></div></Card.Content>
    </Card>);};

export default LeadDetails;
export { LeadDetails };
