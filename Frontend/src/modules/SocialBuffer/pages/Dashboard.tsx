import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { TrendingUp, Users, Calendar, Send, Eye, Heart, MessageCircle, Share2, BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Badge from '@/shared/components/ui/Badge';
import useSocialBuffer from '../hooks/useSocialBuffer';
const Dashboard: React.FC<AuthProps> = ({ auth    }) => {
  const {
    posts,
    socialAccounts,
    schedules,
    engagement,
    fetchPosts,
    fetchSocialAccounts,
    fetchSchedules,
    fetchEngagementOverview,
    getConnectedAccounts,
    getScheduledPosts,
    getPublishedPosts,
    getDraftPosts,
  } = useSocialBuffer();

  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchPosts();

    fetchSocialAccounts();

    fetchSchedules();

    fetchEngagementOverview({ time_range: timeRange });

  }, [timeRange]);

  const connectedAccounts = getConnectedAccounts();

  const scheduledPosts = getScheduledPosts();

  const publishedPosts = getPublishedPosts();

  const draftPosts = getDraftPosts();

  // Calcular métricas
  const totalReach = publishedPosts.reduce((sum: unknown, post: unknown) => sum + (post.reach || 0), 0);

  const totalEngagement = publishedPosts.reduce((sum: unknown, post: unknown) => sum + (post.engagement || 0), 0);

  const avgEngagementRate = publishedPosts.length > 0 ? (totalEngagement / publishedPosts.length) : 0;
  // Próximos posts agendados
  const upcomingPosts = scheduledPosts
    .filter(post => new Date(post.scheduled_at) > new Date())
    .sort((a: unknown, b: unknown) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
    .slice(0, 5);

  // Posts com melhor performance
  const topPosts = publishedPosts
    .sort((a: unknown, b: unknown) => (b.engagement || 0) - (a.engagement || 0))
    .slice(0, 3);

  return (
        <>
      <AuthenticatedLayout user={ auth?.user } />
      <Head title="Dashboard - Social Buffer" / />
      <PageLayout />
        <div className="{/* Header */}">$2</div>
          <div className=" ">$2</div><div>
           
        </div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Visão geral do seu Social Buffer</p></div><div className=" ">$2</div><select
                value={ timeRange }
                onChange={ (e: unknown) => setTimeRange(e.target.value) }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option></select></div>
          {/* Stats Overview */}
          <div className=" ">$2</div><Card />
              <Card.Content className="p-4" />
                <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Posts Publicados</p>
                    <p className="text-2xl font-bold text-gray-900">{publishedPosts.length}</p>
                    <p className="text-xs text-green-600">+12% vs período anterior</p></div><div className=" ">$2</div><Send className="w-6 h-6 text-green-600" /></div></Card.Content></Card><Card />
              <Card.Content className="p-4" />
                <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Alcance Total</p>
                    <p className="text-2xl font-bold text-gray-900">{totalReach.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">+8% vs período anterior</p></div><div className=" ">$2</div><Eye className="w-6 h-6 text-blue-600" /></div></Card.Content></Card><Card />
              <Card.Content className="p-4" />
                <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Engajamento</p>
                    <p className="text-2xl font-bold text-gray-900">{totalEngagement.toLocaleString()}</p>
                    <p className="text-xs text-purple-600">+15% vs período anterior</p></div><div className=" ">$2</div><Heart className="w-6 h-6 text-purple-600" /></div></Card.Content></Card><Card />
              <Card.Content className="p-4" />
                <div className=" ">$2</div><div>
           
        </div><p className="text-sm font-medium text-gray-600">Taxa de Engajamento</p>
                    <p className="text-2xl font-bold text-gray-900">{avgEngagementRate.toFixed(1)}%</p>
                    <p className="text-xs text-orange-600">+3% vs período anterior</p></div><div className=" ">$2</div><TrendingUp className="w-6 h-6 text-orange-600" /></div></Card.Content></Card></div>
          <div className="{/* Contas Conectadas */}">$2</div>
            <Card />
              <Card.Header />
                <Card.Title>Contas Conectadas</Card.Title>
              </Card.Header>
              <Card.Content />
                {connectedAccounts.length === 0 ? (
                  <div className=" ">$2</div><Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Nenhuma conta conectada</p>
                    <Button variant="outline" size="sm" />
                      Conectar Contas
                    </Button>
      </div>
    </>
  ) : (
                  <div className="{(connectedAccounts || []).map((account: unknown) => (">$2</div>
                      <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
           
        </div><div className=" ">$2</div><div className=" ">$2</div><Users className="w-4 h-4 text-gray-600" /></div><div>
           
        </div><p className="font-medium">{account.username}</p>
                            <Badge variant="outline">{account.platform}</Badge></div><Badge variant="success">Ativa</Badge>
      </div>
    </>
  ))}
                  </div>
                )}
              </Card.Content>
            </Card>
            {/* Próximos Posts */}
            <Card />
              <Card.Header />
                <Card.Title>Próximos Posts Agendados</Card.Title>
              </Card.Header>
              <Card.Content />
                {upcomingPosts.length === 0 ? (
                  <div className=" ">$2</div><Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Nenhum post agendado</p>
                    <Button variant="outline" size="sm" />
                      Agendar Post
                    </Button>
      </div>
    </>
  ) : (
                  <div className="{(upcomingPosts || []).map((post: unknown) => (">$2</div>
                      <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
           
        </div><div className=" ">$2</div><p className="font-medium text-sm line-clamp-1">{post.title || 'Sem título'}</p>
                          <p className="text-xs text-gray-500" />
                            {new Date(post.scheduled_at).toLocaleString()}
                          </p></div><Badge variant="info" />
                          <Clock className="w-3 h-3 mr-1" />
                          Agendado
                        </Badge>
      </div>
    </>
  ))}
                  </div>
                )}
              </Card.Content></Card></div>
          {/* Top Posts */}
          <Card />
            <Card.Header />
              <Card.Title>Posts com Melhor Performance</Card.Title>
            </Card.Header>
            <Card.Content />
              {topPosts.length === 0 ? (
                <div className=" ">$2</div><BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum post publicado ainda</p>
      </div>
    </>
  ) : (
                <div className="{(topPosts || []).map((post: unknown, index: unknown) => (">$2</div>
                    <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
           
        </div><div className=" ">$2</div><div className="{index + 1}">$2</div>
                        </div>
                        <div className=" ">$2</div><h3 className="font-medium">{post.title || 'Sem título'}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{post.content}</p>
                          <div className=" ">$2</div><span className=" ">$2</span><Eye className="w-3 h-3" />
                              {post.reach || 0}
                            </span>
                            <span className=" ">$2</span><Heart className="w-3 h-3" />
                              {post.likes || 0}
                            </span>
                            <span className=" ">$2</span><MessageCircle className="w-3 h-3" />
                              {post.comments || 0}
                            </span>
                            <span className=" ">$2</span><Share2 className="w-3 h-3" />
                              {post.shares || 0}
                            </span></div></div>
                      <div className=" ">$2</div><p className="text-sm font-medium text-green-600" />
                          {post.engagement || 0} engajamentos
                        </p>
                        <p className="text-xs text-gray-500" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </p>
      </div>
    </>
  ))}
                </div>
              )}
            </Card.Content>
          </Card>
          {/* Quick Actions */}
          <Card />
            <Card.Header />
              <Card.Title>Ações Rápidas</Card.Title>
            </Card.Header>
            <Card.Content />
              <div className=" ">$2</div><Button className="h-20 flex flex-col items-center justify-center gap-2" />
                  <Send className="w-6 h-6" />
                  <span>Criar Post</span></Button><Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" />
                  <Calendar className="w-6 h-6" />
                  <span>Agendar Post</span></Button><Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" />
                  <BarChart3 className="w-6 h-6" />
                  <span>Ver Analytics</span></Button></div>
            </Card.Content></Card></div></PageLayout></AuthenticatedLayout>);};

export default Dashboard;
