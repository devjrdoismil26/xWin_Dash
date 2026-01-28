import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const ProjectsSettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [autoArchiveDays, setAutoArchiveDays] = useState(find('projects_auto_archive_days') || '90');
  const [defaultStatus, setDefaultStatus] = useState(find('projects_default_status') || 'active');
  const [enableTemplates, setEnableTemplates] = useState(find('projects_enable_templates') || 'true');
  const [requireApproval, setRequireApproval] = useState(find('projects_require_approval') || 'false');
  const [maxMembers, setMaxMembers] = useState(find('projects_max_members') || '10');
  const [enableBudgetTracking, setEnableBudgetTracking] = useState(find('projects_enable_budget_tracking') || 'false');
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Projetos</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="autoArchiveDays">Dias para arquivar automaticamente</InputLabel>
              <Input id="autoArchiveDays" type="number" value={autoArchiveDays} onChange={(e) => setAutoArchiveDays(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="maxMembers">Máximo de membros</InputLabel>
              <Input id="maxMembers" type="number" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="defaultStatus">Status padrão</InputLabel>
              <Select id="defaultStatus" value={defaultStatus} onChange={(e) => setDefaultStatus(e.target.value)}>
                <option value="active">Ativo</option>
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
                <option value="archived">Arquivado</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="enableTemplates">Habilitar templates</InputLabel>
              <Select id="enableTemplates" value={enableTemplates} onChange={(e) => setEnableTemplates(e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="requireApproval">Requer aprovação</InputLabel>
              <Select id="requireApproval" value={requireApproval} onChange={(e) => setRequireApproval(e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="enableBudgetTracking">Controle de orçamento</InputLabel>
              <Select id="enableBudgetTracking" value={enableBudgetTracking} onChange={(e) => setEnableBudgetTracking(e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Select>
            </div>
          </div>
          <div className="pt-2">
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};
export default ProjectsSettings;
