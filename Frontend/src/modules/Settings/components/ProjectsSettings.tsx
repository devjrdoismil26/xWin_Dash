import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
interface ProjectsSettingsProps {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const ProjectsSettings = ({ configs = [] as unknown[] }) => {
  const find = (k: unknown) => configs.find((c: unknown) => c.key === k)?.value;
  const [autoArchiveDays, setAutoArchiveDays] = useState(find('projects_auto_archive_days') || '90');

  const [defaultStatus, setDefaultStatus] = useState(find('projects_default_status') || 'active');

  const [enableTemplates, setEnableTemplates] = useState(find('projects_enable_templates') || 'true');

  const [requireApproval, setRequireApproval] = useState(find('projects_require_approval') || 'false');

  const [maxMembers, setMaxMembers] = useState(find('projects_max_members') || '10');

  const [enableBudgetTracking, setEnableBudgetTracking] = useState(find('projects_enable_budget_tracking') || 'false');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Projetos</Card.Title>
      </Card.Header>
      <Card.Content />
        <form className="space-y-4" onSubmit={ handleSubmit } />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="autoArchiveDays">Dias para arquivar automaticamente</InputLabel>
              <Input id="autoArchiveDays" type="number" value={autoArchiveDays} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setAutoArchiveDays(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="maxMembers">Máximo de membros</InputLabel>
              <Input id="maxMembers" type="number" value={maxMembers} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setMaxMembers(e.target.value) } /></div><div>
           
        </div><InputLabel htmlFor="defaultStatus">Status padrão</InputLabel>
              <Select id="defaultStatus" value={defaultStatus} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setDefaultStatus(e.target.value)  }>
                <option value="active">Ativo</option>
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
                <option value="archived">Arquivado</option></Select></div>
            <div>
           
        </div><InputLabel htmlFor="enableTemplates">Habilitar templates</InputLabel>
              <Select id="enableTemplates" value={enableTemplates} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setEnableTemplates(e.target.value)  }>
                <option value="true">Sim</option>
                <option value="false">Não</option></Select></div>
            <div>
           
        </div><InputLabel htmlFor="requireApproval">Requer aprovação</InputLabel>
              <Select id="requireApproval" value={requireApproval} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setRequireApproval(e.target.value)  }>
                <option value="true">Sim</option>
                <option value="false">Não</option></Select></div>
            <div>
           
        </div><InputLabel htmlFor="enableBudgetTracking">Controle de orçamento</InputLabel>
              <Select id="enableBudgetTracking" value={enableBudgetTracking} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setEnableBudgetTracking(e.target.value)  }>
                <option value="true">Sim</option>
                <option value="false">Não</option></Select></div>
          <div className=" ">$2</div><Button type="submit">Salvar</Button></div></form>
      </Card.Content>
    </Card>);};

export default ProjectsSettings;
