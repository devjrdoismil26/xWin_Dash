/**
 * Formulário de usuário
 *
 * @description
 * Componente completo para criar e editar usuários do sistema.
 * Suporta campos de nome, email, senha, role, status, telefone, timezone e idioma.
 * Inclui validação e controle de visibilidade de senha.
 *
 * @module modules/Users/components/UserForm
 * @since 1.0.0
 */

import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import Select, { SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/shared/components/ui/Select';
import Badge from '@/shared/components/ui/Badge';
import { User, Mail, Phone, Shield, Eye, EyeOff } from 'lucide-react';
import { User as UserType } from '../types/user.types';

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
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; };

  onInputChange?: (e: any) => void;
  roles: Array<{ id: number; name: string; slug: string; description?: string }>;
  isEditing: boolean;
  showPassword: boolean;
  onTogglePassword??: (e: any) => void;
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

export const UserForm: React.FC<UserFormProps> = ({ formData,
  onInputChange,
  roles,
  isEditing,
  showPassword,
  onTogglePassword
   }) => {
  return (
            <div className="{/* Basic Information */}">$2</div>
      <Card />
        <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <User className="w-5 h-5" />
            Informações Básicas
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6" />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="name">Nome Completo *</InputLabel>
              <Input
                id="name"
                value={ formData.name }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onInputChange('name', e.target.value) }
                placeholder="Digite o nome completo"
                required /></div><div>
           
        </div><InputLabel htmlFor="email">Email *</InputLabel>
              <Input
                id="email"
                type="email"
                value={ formData.email }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onInputChange('email', e.target.value) }
                placeholder="Digite o email"
                required /></div><div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="phone">Telefone</InputLabel>
              <Input
                id="phone"
                type="tel"
                value={ formData.phone }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onInputChange('phone', e.target.value) }
                placeholder="(11) 99999-9999" /></div><div>
           
        </div><InputLabel htmlFor="password" />
                {isEditing ? 'Nova Senha' : 'Senha *'}
                {!isEditing && <span className="text-red-500 ml-1">*</span>}
              </InputLabel>
              <div className=" ">$2</div><Input
                  id="password"
                  type={ showPassword ? 'text' : 'password' }
                  value={ formData.password }
                  onChange={ (e: React.ChangeEvent<HTMLInputElement>) => onInputChange('password', e.target.value) }
                  placeholder={ isEditing ? 'Deixe em branco para manter' : 'Digite a senha' }
                  required={ !isEditing } />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={ onTogglePassword } />
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button></div></div>
        </Card.Content>
      </Card>

      {/* Role and Status */}
      <Card />
        <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <Shield className="w-5 h-5" />
            Permissões e Status
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6" />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="role">Role *</InputLabel>
              <Select
                value={ formData.role }
                onValueChange={ (value: unknown) => onInputChange('role', value) }
                required
              >
                <SelectTrigger />
                  <SelectValue placeholder="Selecione um role" / /></SelectTrigger><SelectContent />
                  {(roles || []).map((role: unknown) => (
                    <SelectItem key={role.id} value={ role.slug } />
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent></Select></div>
            <div>
           
        </div><InputLabel htmlFor="status">Status *</InputLabel>
              <Select
                value={ formData.status }
                onValueChange={ (value: unknown) => onInputChange('status', value) }
                required
              >
                <SelectTrigger />
                  <SelectValue placeholder="Selecione um status" / /></SelectTrigger><SelectContent />
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem></SelectContent></Select></div><div className=" ">$2</div><Badge 
              variant={ formData.status === 'active' ? 'default' : 'outline' }
              className="text-xs" />
              {formData.status}
            </Badge>
            <span className="{roles.find(r => r.slug === formData.role)?.description}">$2</span>
            </span></div></Card.Content>
      </Card>

      {/* Preferences */}
      <Card />
        <Card.Header />
          <Card.Title className="flex items-center gap-2" />
            <Phone className="w-5 h-5" />
            Preferências
          </Card.Title>
        </Card.Header>
        <Card.Content className="space-y-6" />
          <div className=" ">$2</div><div>
           
        </div><InputLabel htmlFor="timezone">Fuso Horário</InputLabel>
              <Select
                value={ formData.timezone }
                onValueChange={ (value: unknown) => onInputChange('timezone', value)  }>
                <SelectTrigger />
                  <SelectValue placeholder="Selecione o fuso horário" / /></SelectTrigger><SelectContent />
                  <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tóquio (GMT+9)</SelectItem></SelectContent></Select></div><div>
           
        </div><InputLabel htmlFor="language">Idioma</InputLabel>
              <Select
                value={ formData.language }
                onValueChange={ (value: unknown) => onInputChange('language', value)  }>
                <SelectTrigger />
                  <SelectValue placeholder="Selecione o idioma" / /></SelectTrigger><SelectContent />
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                  <SelectItem value="fr-FR">Français</SelectItem></SelectContent></Select></div></Card.Content></Card></div>);};

export default UserForm;