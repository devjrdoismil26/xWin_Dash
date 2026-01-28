/**
 * Página de criação do ADStool
 * Formulário para criar novas campanhas, contas ou criativos
 */
import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';

interface ADStoolCreatePageProps {
  auth?: any;
  type: 'campaign' | 'account' | 'creative';
}

const ADStoolCreatePage: React.FC<ADStoolCreatePageProps> = ({ 
  auth, 
  type 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    budget: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simular criação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirecionar após sucesso
      window.location.href = '/adstool';
    } catch (error) {
      console.error('Erro ao criar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getTitle = () => {
    switch (type) {
      case 'campaign': return 'Nova Campanha';
      case 'account': return 'Nova Conta';
      case 'creative': return 'Novo Criativo';
      default: return 'Novo Item';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'campaign': return 'Crie uma nova campanha de anúncios';
      case 'account': return 'Conecte uma nova conta de anúncios';
      case 'creative': return 'Crie um novo anúncio criativo';
      default: return 'Crie um novo item';
    }
  };

  return (
    <PageTransition type="fade" duration={500}>
      <AuthenticatedLayout user={auth?.user}>
        <Head title={`${getTitle()} - ADStool - xWin Dash`} />
        <PageLayout>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link href="/adstool">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {getTitle()}
                </h1>
                <p className="text-gray-600 mt-1">
                  {getDescription()}
                </p>
              </div>
            </div>

            {/* Form */}
            <Card>
              <Card.Content className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Digite o nome do ${type}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-2">
                      Plataforma *
                    </label>
                    <select
                      id="platform"
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma plataforma</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="LinkedIn Ads">LinkedIn Ads</option>
                      <option value="Twitter Ads">Twitter Ads</option>
                    </select>
                  </div>

                  {type === 'campaign' && (
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Orçamento Diário (R$)
                      </label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Descreva o ${type}...`}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Link href="/adstool">
                      <Button variant="outline" type="button">
                        Cancelar
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Criando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Criar {type}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>

            {/* Quick Tips */}
            <Card>
              <Card.Header>
                <Card.Title>Dicas Rápidas</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {type === 'campaign' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Defina um orçamento realista</p>
                          <p className="text-sm text-gray-600">
                            Comece com um orçamento menor e aumente conforme os resultados.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Escolha o público certo</p>
                          <p className="text-sm text-gray-600">
                            Defina bem seu público-alvo para melhor performance.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {type === 'account' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Verifique as permissões</p>
                          <p className="text-sm text-gray-600">
                            Certifique-se de ter as permissões necessárias na conta.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {type === 'creative' && (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-100 rounded-full mt-1">
                          <Plus className="w-3 h-3 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Use imagens de alta qualidade</p>
                          <p className="text-sm text-gray-600">
                            Imagens nítidas e atrativas geram melhores resultados.
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        </PageLayout>
      </AuthenticatedLayout>
    </PageTransition>
  );
};

export default ADStoolCreatePage;
