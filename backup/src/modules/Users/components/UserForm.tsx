import React, { useState } from 'react';
import { Card } from "@/components/ui/Card";
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { Select } from '@/components/ui/select';
import Badge from '@/components/ui/Badge';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Eye,
  EyeOff
} from 'lucide-react';
import { User as UserType } from '../types/userTypes';

// =========================================
// INTERFACES
// =========================================

interface UserFormProps {
  formData: {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    phone: string;
    timezone: string;
    language: string;
  };
  onInputChange: (field: string, value: string) => void;
  roles: Array<{ id: number; name: string; slug: string; description?: string }>;
  isEditing: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const UserForm: React.FC<UserFormProps> = ({
  formData,
  onInputChange,
  roles,
  isEditing,
  showPassword,
  onTogglePassword
}) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Básicas
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="name">Nome Completo *</InputLabel>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>
            <div>
              <InputLabel htmlFor="email">Email *</InputLabel>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                placeholder="Digite o email"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="phone">Telefone</InputLabel>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <InputLabel htmlFor="password">
                {isEditing ? 'Nova Senha' : 'Senha *'}
                {!isEditing && <span className="text-red-500 ml-1">*</span>}
              </InputLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => onInputChange('password', e.target.value)}
                  placeholder={isEditing ? 'Deixe em branco para manter' : 'Digite a senha'}
                  required={!isEditing}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={onTogglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Role and Status */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissões e Status
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="role">Role *</InputLabel>
              <Select
                value={formData.role}
                onValueChange={(value) => onInputChange('role', value)}
                required
              >
                <Select.Trigger>
                  <Select.Value placeholder="Selecione um role" />
                </Select.Trigger>
                <Select.Content>
                  {roles.map((role) => (
                    <Select.Item key={role.id} value={role.slug}>
                      {role.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="status">Status *</InputLabel>
              <Select
                value={formData.status}
                onValueChange={(value) => onInputChange('status', value)}
                required
              >
                <Select.Trigger>
                  <Select.Value placeholder="Selecione um status" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="active">Ativo</Select.Item>
                  <Select.Item value="inactive">Inativo</Select.Item>
                  <Select.Item value="suspended">Suspenso</Select.Item>
                  <Select.Item value="pending">Pendente</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={formData.status === 'active' ? 'default' : 'outline'}
              className="text-xs"
            >
              {formData.status}
            </Badge>
            <span className="text-sm text-gray-600">
              {roles.find(r => r.slug === formData.role)?.description}
            </span>
          </div>
        </Card.Content>
      </Card>

      {/* Preferences */}
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Preferências
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputLabel htmlFor="timezone">Fuso Horário</InputLabel>
              <Select
                value={formData.timezone}
                onValueChange={(value) => onInputChange('timezone', value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Selecione o fuso horário" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="America/Sao_Paulo">São Paulo (GMT-3)</Select.Item>
                  <Select.Item value="America/New_York">Nova York (GMT-5)</Select.Item>
                  <Select.Item value="Europe/London">Londres (GMT+0)</Select.Item>
                  <Select.Item value="Asia/Tokyo">Tóquio (GMT+9)</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div>
              <InputLabel htmlFor="language">Idioma</InputLabel>
              <Select
                value={formData.language}
                onValueChange={(value) => onInputChange('language', value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Selecione o idioma" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="pt-BR">Português (Brasil)</Select.Item>
                  <Select.Item value="en-US">English (US)</Select.Item>
                  <Select.Item value="es-ES">Español</Select.Item>
                  <Select.Item value="fr-FR">Français</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default UserForm;