import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import ErrorState from '@/shared/components/ui/ErrorState';
import { Save, ArrowLeft, User } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { User as UserType } from '../types/user.types';
import UserForm from './UserForm';

// =========================================
// INTERFACES
// =========================================

interface UserCreateEditProps {
  auth?: string;
  userId?: number;
  onClose???: (e: any) => void;
  onSave??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const UserCreateEdit: React.FC<UserCreateEditProps> = ({ auth,
  userId,
  onClose,
  onSave
   }) => {
  const [user, setUser] = useState<UserType | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    status: 'active',
    phone: '',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR'
  });

  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!userId;

  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    getUser
  } = useUsers();

  // Mock roles - em uma implementação real, viria do backend
  const roles = [
    { id: 1, name: 'Administrador', slug: 'admin', description: 'Acesso total ao sistema' },
    { id: 2, name: 'Gerente', slug: 'manager', description: 'Acesso de gerenciamento' },
    { id: 3, name: 'Usuário', slug: 'member', description: 'Acesso básico' },
    { id: 4, name: 'Visitante', slug: 'guest', description: 'Acesso limitado' }
  ];

  useEffect(() => {
    if (isEditing && userId) {
      loadUser();

    } , [isEditing, userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
        phone: user.phone || '',
        timezone: user.timezone || 'America/Sao_Paulo',
        language: user.language || 'pt-BR'
      });

    } , [user]);

  const loadUser = async () => {
    if (!userId) return;
    
    try {
      const userData = await getUser(userId.toString());

      if (userData) {
        setUser(userData);

      } catch (error) {
    } ;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      let savedUser: UserType;

      if (isEditing && userId) {
        savedUser = await updateUser(userId.toString(), formData);

      } else {
        savedUser = await createUser(formData);

      }

      if (onSave) {
        onSave(savedUser);

      }

      if (onClose) {
        onClose();

      } catch (error) {
    } finally {
      setIsSubmitting(false);

    } ;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);};

  if (loading && isEditing) {
    return (
        <>
      <AppLayout
        title={ isEditing ? 'Editar Usuário' : 'Novo Usuário' }
        subtitle={ isEditing ? 'Edite as informações do usuário' : 'Crie um novo usuário' }
        showSidebar={ true }
        useGlassmorphismSidebar={ true } />
      <Head title={`${isEditing ? 'Editar' : 'Novo'} Usuário - xWin Dash`} / />
        <div className=" ">$2</div><div className=" ">$2</div><div className="h-32 bg-gray-200 rounded-lg" /></div></AppLayout>);

  }

  if (error) {
    return (
        <>
      <AppLayout
        title={ isEditing ? 'Editar Usuário' : 'Novo Usuário' }
        subtitle={ isEditing ? 'Edite as informações do usuário' : 'Crie um novo usuário' }
        showSidebar={ true }
        useGlassmorphismSidebar={ true } />
      <Head title={`${isEditing ? 'Editar' : 'Novo'} Usuário - xWin Dash`} / />
        <ErrorState
          icon={ User }
          title="Erro"
          description={ error }
          actions={ [
            {
              label: "Tentar Novamente",
              onClick: () => window.location.reload(),
              variant: "default",
              icon: User
             }
          ]} />
      </AppLayout>);

  }

  return (
            <AppLayout
      title={ isEditing ? 'Editar Usuário' : 'Novo Usuário' }
      subtitle={ isEditing ? 'Edite as informações do usuário' : 'Crie um novo usuário' }
      showSidebar={ true }
      useGlassmorphismSidebar={ true }
      headerActions={ <div className=" ">$2</div><Button variant="outline" onClick={onClose } />
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleSubmit} disabled={ isSubmitting } />
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
  }
  >
      <Head title={`${isEditing ? 'Editar' : 'Novo'} Usuário - xWin Dash`} / />
      <form onSubmit={handleSubmit} className="space-y-6" />
        <UserForm
          formData={ formData }
          onInputChange={ handleInputChange }
          roles={ roles }
          isEditing={ isEditing }
          showPassword={ showPassword }
          onTogglePassword={ handleTogglePassword  }>
          {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50" />
            <Card.Content className="p-4" />
              <p className="text-red-600 text-sm">{error}</p>
            </Card.Content>
      </Card>
    </>
  )}
      </form>
    </AppLayout>);};

export default UserCreateEdit;