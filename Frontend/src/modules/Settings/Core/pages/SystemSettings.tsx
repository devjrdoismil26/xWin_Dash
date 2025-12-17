/**
 * Página de Configurações do Sistema - Settings
 *
 * @description
 * Página para configurações gerais do sistema incluindo nome do site, timezone,
 * ambiente, modo debug, modo de manutenção e limites de upload/sessão.
 *
 * @module modules/Settings/Core/pages/SystemSettings
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select from '@/shared/components/ui/Select';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import useToast from '@/shared/components/ui/useToast';
import { useSettings } from '@/modules/Settings/hooks/useSettings';

/**
 * Componente SystemSettings
 *
 * @description
 * Renderiza página de configurações do sistema com formulário completo.
 * Permite configurar nome do site, timezone, ambiente, debug, manutenção e limites.
 *
 * @returns {JSX.Element} Página de configurações do sistema
 */
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

    } , [settings]);

  const handleSubmit = async (e: unknown) => {
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

    } ;

  const handleInputChange = (field: unknown, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground" />
            Gerencie as configurações principais da aplicação
          </p></div><Badge variant={ formData.environment === 'production' ? 'default' : 'secondary' } />
          {formData.environment}
        </Badge></div><form onSubmit={handleSubmit} className="space-y-6" />
        <Card />
          <Card.Header />
            <Card.Title>Configurações Gerais</Card.Title>
            <Card.Description />
              Configurações básicas da aplicação
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6" />
            <div className=" ">$2</div><div className=" ">$2</div><InputLabel htmlFor="site_name">Nome do Site</InputLabel>
                <Input
                  id="site_name"
                  value={ formData.site_name }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('site_name', e.target.value) }
                  placeholder="Digite o nome do site" /></div><div className=" ">$2</div><InputLabel htmlFor="timezone">Fuso Horário</InputLabel>
                <Select
                  id="timezone"
                  value={ formData.timezone }
                  onValueChange={ (value: unknown) => handleInputChange('timezone', value)  }>
                  <option value="UTC">UTC</option>
                  <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                  <option value="America/New_York">Nova York (EST)</option>
                  <option value="America/Los_Angeles">Los Angeles (PST)</option>
                  <option value="Europe/London">Londres (GMT)</option></Select></div>
            <div className=" ">$2</div><div className=" ">$2</div><InputLabel htmlFor="max_upload_size">Tamanho Máximo de Upload</InputLabel>
                <Select
                  id="max_upload_size"
                  value={ formData.max_upload_size }
                  onValueChange={ (value: unknown) => handleInputChange('max_upload_size', value)  }>
                  <option value="5MB">5MB</option>
                  <option value="10MB">10MB</option>
                  <option value="25MB">25MB</option>
                  <option value="50MB">50MB</option>
                  <option value="100MB">100MB</option></Select></div>
              <div className=" ">$2</div><InputLabel htmlFor="session_lifetime">Tempo de Sessão (minutos)</InputLabel>
                <Input
                  id="session_lifetime"
                  type="number"
                  value={ formData.session_lifetime }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('session_lifetime', parseInt(e.target.value)) }
                  min="30"
                  max="1440" /></div></Card.Content></Card><Card />
          <Card.Header />
            <Card.Title>Configurações de Ambiente</Card.Title>
            <Card.Description />
              Configurações de desenvolvimento e produção
            </Card.Description>
          </Card.Header>
          <Card.Content className="space-y-6" />
            <div className=" ">$2</div><div className=" ">$2</div><InputLabel htmlFor="environment">Ambiente</InputLabel>
                <Select
                  id="environment"
                  value={ formData.environment }
                  onValueChange={ (value: unknown) => handleInputChange('environment', value)  }>
                  <option value="local">Local</option>
                  <option value="staging">Staging</option>
                  <option value="production">Produção</option></Select></div>
              <div className=" ">$2</div><div className=" ">$2</div><input
                    type="checkbox"
                    id="debug_mode"
                    checked={ formData.debug_mode }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('debug_mode', e.target.checked) }
                    className="rounded border-gray-300" />
                  <InputLabel htmlFor="debug_mode">Modo Debug</InputLabel></div><div className=" ">$2</div><input
                    type="checkbox"
                    id="maintenance_mode"
                    checked={ formData.maintenance_mode }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('maintenance_mode', e.target.checked) }
                    className="rounded border-gray-300" />
                  <InputLabel htmlFor="maintenance_mode">Modo Manutenção</InputLabel></div></div>
          </Card.Content></Card><div className=" ">$2</div><Button type="submit" disabled={ isLoading } />
            {isLoading ? 'Salvando...' : 'Salvar Configurações'}
          </Button></div></form>
    </div>);

}
