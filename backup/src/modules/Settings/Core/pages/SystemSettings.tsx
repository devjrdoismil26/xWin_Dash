import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import useToast from '@/components/ui/useToast';
import { useSettings } from '@/modules/Settings/hooks/useSettings';
export default function SystemSettings() {
  const { toast } = useToast();
  const { settings, updateSetting, isLoading } = useSettings();
  const [formData, setFormData] = useState({
    site_name: '',
    timezone: 'UTC',
    environment: 'production',
    debug_mode: false,
    maintenance_mode: false,
    max_upload_size: '10MB',
    session_lifetime: 120
  });
  useEffect(() => {
    if (settings) {
      setFormData({
        site_name: settings.site_name || 'xWin',
        timezone: settings.timezone || 'UTC',
        environment: settings.environment || 'production',
        debug_mode: settings.debug_mode || false,
        maintenance_mode: settings.maintenance_mode || false,
        max_upload_size: settings.max_upload_size || '10MB',
        session_lifetime: settings.session_lifetime || 120
      });
    }
  }, [settings]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSetting('system', formData);
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    }
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações principais da aplicação
          </p>
        </div>
        <Badge variant={formData.environment === 'production' ? 'default' : 'secondary'}>
          {formData.environment}
        </Badge>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <Card.Header>
            <Card.Title>Configurações Gerais</Card.Title>
            <Card.Description>
              Configurações básicas da aplicação
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <InputLabel htmlFor="site_name">Nome do Site</InputLabel>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  placeholder="Digite o nome do site"
                />
              </div>
              <div className="space-y-2">
                <InputLabel htmlFor="timezone">Fuso Horário</InputLabel>
                <Select
                  id="timezone"
                  value={formData.timezone}
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                  <option value="America/New_York">Nova York (EST)</option>
                  <option value="America/Los_Angeles">Los Angeles (PST)</option>
                  <option value="Europe/London">Londres (GMT)</option>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <InputLabel htmlFor="max_upload_size">Tamanho Máximo de Upload</InputLabel>
                <Select
                  id="max_upload_size"
                  value={formData.max_upload_size}
                  onValueChange={(value) => handleInputChange('max_upload_size', value)}
                >
                  <option value="5MB">5MB</option>
                  <option value="10MB">10MB</option>
                  <option value="25MB">25MB</option>
                  <option value="50MB">50MB</option>
                  <option value="100MB">100MB</option>
                </Select>
              </div>
              <div className="space-y-2">
                <InputLabel htmlFor="session_lifetime">Tempo de Sessão (minutos)</InputLabel>
                <Input
                  id="session_lifetime"
                  type="number"
                  value={formData.session_lifetime}
                  onChange={(e) => handleInputChange('session_lifetime', parseInt(e.target.value))}
                  min="30"
                  max="1440"
                />
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <Card.Title>Configurações de Ambiente</Card.Title>
            <Card.Description>
              Configurações de desenvolvimento e produção
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <InputLabel htmlFor="environment">Ambiente</InputLabel>
                <Select
                  id="environment"
                  value={formData.environment}
                  onValueChange={(value) => handleInputChange('environment', value)}
                >
                  <option value="local">Local</option>
                  <option value="staging">Staging</option>
                  <option value="production">Produção</option>
                </Select>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="debug_mode"
                    checked={formData.debug_mode}
                    onChange={(e) => handleInputChange('debug_mode', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <InputLabel htmlFor="debug_mode">Modo Debug</InputLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintenance_mode"
                    checked={formData.maintenance_mode}
                    onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <InputLabel htmlFor="maintenance_mode">Modo Manutenção</InputLabel>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
