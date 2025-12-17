import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building, Calendar, Star } from 'lucide-react';
import { ModuleLayout, PageHeader, Card, Button } from '@/shared/components/ui';
import { useLeads } from '../hooks/useLeads';
import { Lead } from '../types';
import { formatDate } from '@/shared/utils';

interface LeadDetailPageProps {
  leadId: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const LeadDetailPage: React.FC<LeadDetailPageProps> = ({ leadId    }) => {
  const { getLead, deleteLead, loading } = useLeads();

  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLead();

  }, [leadId]);

  const loadLead = async () => {
    const data = await getLead(leadId);

    setLead(data);};

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este lead?')) {
      await deleteLead(leadId);

      router.visit('/leads');

    } ;

  if (loading || !lead) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
            <>
      <Head title={`${lead.name} - Lead`} / />
      <ModuleLayout
        moduleTitle="Leads"
        moduleIcon="users"
        menuItems={[
          { label: 'Lista', path: '/leads', icon: 'list' },
          { label: 'Analytics', path: '/leads/analytics', icon: 'chart' }
        ]} />
        <PageHeader
          title={ lead.name }
          subtitle={ lead.company || 'Lead' }
          actions={ [
            <Button key="back" variant="ghost" size="sm" onClick={() => router.visit('/leads')  }>
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>,
            <Button key="edit" variant="secondary" size="sm" onClick={() => router.visit(`/leads/${leadId}/edit`)}>
              <Edit className="w-4 h-4" />
              Editar
            </Button>,
            <Button key="delete" variant="danger" size="sm" onClick={ handleDelete } />
              <Trash2 className="w-4 h-4" />
              Excluir
            </Button>
          ]} />

        <div className=" ">$2</div><div className=" ">$2</div><Card title="Informações Principais" />
              <div className=" ">$2</div><div className=" ">$2</div><Mail className="w-5 h-5 text-gray-400" />
                  <div>
           
        </div><p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>

                {lead.phone && (
                  <div className=" ">$2</div><Phone className="w-5 h-5 text-gray-400" />
                    <div>
           
        </div><p className="text-sm text-gray-500">Telefone</p>
                      <p className="font-medium">{lead.phone}</p>
      </div>
    </>
  )}

                {lead.company && (
                  <div className=" ">$2</div><Building className="w-5 h-5 text-gray-400" />
                    <div>
           
        </div><p className="text-sm text-gray-500">Empresa</p>
                      <p className="font-medium">{lead.company}</p>
      </div>
    </>
  )}

                <div className=" ">$2</div><Calendar className="w-5 h-5 text-gray-400" />
                  <div>
           
        </div><p className="text-sm text-gray-500">Data de Cadastro</p>
                    <p className="font-medium">{formatDate(lead.created_at)}</p></div></div></Card><Card title="Atividades Recentes" />
              <p className="text-gray-500">Nenhuma atividade registrada</p></Card></div>

          <div className=" ">$2</div><Card title="Status" />
              <div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-500 mb-2">Status Atual</p>
                  <span className="{lead.status}">$2</span>
                  </span></div><div>
           
        </div><p className="text-sm text-gray-500 mb-2">Origem</p>
                  <span className="{lead.origin}">$2</span>
                  </span></div><div>
           
        </div><p className="text-sm text-gray-500 mb-2">Score</p>
                  <div className=" ">$2</div><Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold">{lead.score || 0}</span></div></div></Card><Card title="Tags" />
              <p className="text-gray-500">Nenhuma tag atribuída</p></Card></div></ModuleLayout></>);};
