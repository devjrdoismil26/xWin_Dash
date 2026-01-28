import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const DatabaseSettings = ({ configs = [] }) => {
  const find = (k) => configs.find((c) => c.key === k)?.value;
  const [backupEnabled, setBackupEnabled] = useState(find('database_backup_enabled') || 'true');
  const [backupFrequency, setBackupFrequency] = useState(find('database_backup_frequency') || 'daily');
  const [backupRetentionDays, setBackupRetentionDays] = useState(find('database_backup_retention_days') || '30');
  const [connectionTimeout, setConnectionTimeout] = useState(find('database_connection_timeout') || '60');
  const [maxConnections, setMaxConnections] = useState(find('database_max_connections') || '100');
  const [queryTimeout, setQueryTimeout] = useState(find('database_query_timeout') || '30');
  const [enableLogging, setEnableLogging] = useState(find('database_enable_logging') || 'false');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Banco de Dados</Card.Title>
      </Card.Header>
      <Card.Content>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <InputLabel htmlFor="backupEnabled">Backup Ativo</InputLabel>
              <Select id="backupEnabled" value={backupEnabled} onChange={(e) => setBackupEnabled(e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="backupFrequency">Frequência</InputLabel>
              <Select id="backupFrequency" value={backupFrequency} onChange={(e) => setBackupFrequency(e.target.value)}>
                <option value="hourly">De hora em hora</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="retention">Retenção (dias)</InputLabel>
              <Input id="retention" type="number" value={backupRetentionDays} onChange={(e) => setBackupRetentionDays(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="maxConnections">Máx. conexões</InputLabel>
              <Input id="maxConnections" type="number" value={maxConnections} onChange={(e) => setMaxConnections(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="connTimeout">Timeout conexão (s)</InputLabel>
              <Input id="connTimeout" type="number" value={connectionTimeout} onChange={(e) => setConnectionTimeout(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="queryTimeout">Timeout query (s)</InputLabel>
              <Input id="queryTimeout" type="number" value={queryTimeout} onChange={(e) => setQueryTimeout(e.target.value)} />
            </div>
            <div>
              <InputLabel htmlFor="logging">Log de queries</InputLabel>
              <Select id="logging" value={enableLogging} onChange={(e) => setEnableLogging(e.target.value)}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Select>
            </div>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </Card.Content>
    </Card>
  );
};
export default DatabaseSettings;
