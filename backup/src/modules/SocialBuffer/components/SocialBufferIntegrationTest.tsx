import React from 'react';
import { Share2, Users, BarChart3, Calendar, MessageSquare } from 'lucide-react';
import IntegrationTest, { TestCase } from '@/components/ui/IntegrationTest';
import useSocialBuffer from '../hooks/useSocialBuffer';

const SocialBufferIntegrationTest: React.FC = () => {
  const { 
    socialAccounts, 
    posts, 
    loading, 
    error,
    fetchSocialAccounts,
    createPost,
    schedulePost,
    publishPost,
    getAnalytics
  } = useSocialBuffer();

  const tests: TestCase[] = [
    {
      id: 'connection',
      name: 'Teste de Conexão',
      description: 'Verifica conectividade com SocialBuffer',
      icon: Share2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      action: async () => {
        try {
          await fetchSocialAccounts();
          return { success: true, message: 'Conexão com SocialBuffer estabelecida com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha na conexão', error: error.message };
        }
      }
    },
    {
      id: 'account-management',
      name: 'Gerenciamento de Contas',
      description: 'Testa operações com contas sociais',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      action: async () => {
        try {
          await fetchSocialAccounts();
          return { success: true, message: 'Contas sociais carregadas com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha ao carregar contas', error: error.message };
        }
      }
    },
    {
      id: 'post-creation',
      name: 'Criação de Posts',
      description: 'Testa criação de posts',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      action: async () => {
        try {
          const testPost = {
            content: 'Post de teste',
            platforms: ['facebook', 'twitter'],
            scheduled_at: null
          };
          await createPost(testPost);
          return { success: true, message: 'Post criado com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha ao criar post', error: error.message };
        }
      }
    },
    {
      id: 'post-scheduling',
      name: 'Agendamento de Posts',
      description: 'Testa agendamento de posts',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      action: async () => {
        try {
          if (posts && posts.length > 0) {
            await schedulePost(posts[0].id, new Date(Date.now() + 3600000));
            return { success: true, message: 'Post agendado com sucesso' };
          }
          return { success: false, message: 'Nenhum post disponível para agendamento' };
        } catch (error: any) {
          return { success: false, message: 'Falha no agendamento', error: error.message };
        }
      }
    },
    {
      id: 'analytics',
      name: 'Analytics Sociais',
      description: 'Testa métricas e analytics',
      icon: BarChart3,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      action: async () => {
        try {
          await getAnalytics();
          return { success: true, message: 'Analytics carregados com sucesso' };
        } catch (error: any) {
          return { success: false, message: 'Falha nos analytics', error: error.message };
        }
      }
    }
  ];

  const statsConfig = {
    stats: [
      {
        label: 'Contas Conectadas',
        value: socialAccounts?.length || 0,
        color: 'blue'
      },
      {
        label: 'Posts Agendados',
        value: posts?.filter(p => p.scheduled_at).length || 0,
        color: 'green'
      },
      {
        label: 'Posts Publicados',
        value: posts?.filter(p => p.status === 'published').length || 0,
        color: 'purple'
      },
      {
        label: 'Engajamento Médio',
        value: 85, // Placeholder - seria calculado com dados reais
        color: 'teal'
      }
    ]
  };

  return (
    <IntegrationTest
      moduleName="SocialBuffer"
      moduleDescription="Sistema de gestão e automação de redes sociais"
      tests={tests}
      statsConfig={statsConfig}
      loading={loading}
      error={error}
    />
  );
};

export default SocialBufferIntegrationTest;
