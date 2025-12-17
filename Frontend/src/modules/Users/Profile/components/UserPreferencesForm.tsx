import React, { useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { toast } from 'sonner';
import Button from '@/shared/components/ui/Button';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select, { SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import Switch from '@/shared/components/ui/Switch';
const UserPreferencesForm = ({ preferences, onUpdate, loading }) => {
  const { data, setData, patch, processing, recentlySuccessful } = useForm({
    preferences: {
      language: preferences?.language || 'pt-BR',
      darkMode: preferences?.darkMode || false,
      notificationsEnabled: preferences?.notificationsEnabled || true,
      emailNotifications: preferences?.emailNotifications || true,
      timezone: preferences?.timezone || 'America/Sao_Paulo',
    } );

  const handleInputChange = useCallback((field: unknown, value: unknown) => {
    setData('preferences', {
      ...data.preferences,
      [field]: value
    });

  }, [data.preferences, setData]);

  const handleSubmit = useCallback((e: unknown) => {
    e.preventDefault();

    patch(route('profile.preferences.update'), {
      onSuccess: () => {
        toast.success('Preferências atualizadas com sucesso!');

        onUpdate?.();

      },
      onError: () => {
        toast.error('Erro ao atualizar preferências.');

      } );

  }, [patch, onUpdate]);

  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' }
  ];
  const timezoneOptions = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
    { value: 'America/New_York', label: 'Nova York (GMT-5)' },
    { value: 'Europe/London', label: 'Londres (GMT+0)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (GMT+9)' }
  ];
  return (
        <>
      <form onSubmit={handleSubmit} className="space-y-6" />
      <div className=" ">$2</div><h3 className="text-lg font-medium text-gray-900 mb-6" />
          Configurações Gerais
        </h3>
        <div className="{/* Language */}">$2</div>
          <div>
           
        </div><InputLabel htmlFor="language">Idioma</InputLabel>
            <Select 
              value={ data.preferences.language }
              onValueChange={ (value: unknown) => handleInputChange('language', value)  }>
              <SelectTrigger />
                <SelectValue placeholder="Selecione um idioma" / /></SelectTrigger><SelectContent />
                {(languageOptions || []).map((option: unknown) => (
                  <SelectItem key={option.value} value={ option.value } />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent></Select></div>
          {/* Timezone */}
          <div>
           
        </div><InputLabel htmlFor="timezone">Fuso Horário</InputLabel>
            <Select 
              value={ data.preferences.timezone }
              onValueChange={ (value: unknown) => handleInputChange('timezone', value)  }>
              <SelectTrigger />
                <SelectValue placeholder="Selecione um fuso horário" / /></SelectTrigger><SelectContent />
                {(timezoneOptions || []).map((option: unknown) => (
                  <SelectItem key={option.value} value={ option.value } />
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent></Select></div>
          {/* Dark Mode */}
          <div className=" ">$2</div><div>
           
        </div><h4 className="text-sm font-medium text-gray-900">Tema Escuro</h4>
              <p className="text-sm text-gray-600" />
                Ativar tema escuro na interface
              </p></div><Switch 
              checked={ data.preferences.darkMode }
              onCheckedChange={ (checked: unknown) => handleInputChange('darkMode', checked) } />
          </div>
          {/* Notifications */}
          <div className=" ">$2</div><div>
           
        </div><h4 className="text-sm font-medium text-gray-900">Notificações</h4>
              <p className="text-sm text-gray-600" />
                Receber notificações em tempo real
              </p></div><Switch 
              checked={ data.preferences.notificationsEnabled }
              onCheckedChange={ (checked: unknown) => handleInputChange('notificationsEnabled', checked) } />
          </div>
          {/* Email Notifications */}
          <div className=" ">$2</div><div>
           
        </div><h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
              <p className="text-sm text-gray-600" />
                Receber notificações por email
              </p></div><Switch 
              checked={ data.preferences.emailNotifications }
              onCheckedChange={ (checked: unknown) => handleInputChange('emailNotifications', checked) } />
          </div>
        {/* Submit Button */}
        <div className=" ">$2</div><div className=" ">$2</div><Button 
              type="submit"
              variant="primary"
              loading={ processing || loading }
              disabled={ processing || loading } />
              Salvar Preferências
            </Button>
            {recentlySuccessful && (
              <span className="Preferências salvas com sucesso!">$2</span>
      </span>
    </>
  )}
          </div></div></form>);};

export default UserPreferencesForm;
