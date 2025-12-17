import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsCreateForm } from '../components/AnalyticsCreateForm';
import { AnalyticsPreview } from '../components/AnalyticsPreview';

export const AnalyticsCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({});

  return (
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Button onClick={() => navigate(-1)} variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" /></Button><h1 className="text-2xl font-bold text-white">Criar Relatório Analytics</h1></div><div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Header />
            <Card.Title>Configuração</Card.Title>
          </Card.Header>
          <Card.Content />
            <AnalyticsCreateForm data={formData} onChange={setFormData} / />
          </Card.Content></Card><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
          <Card.Header />
            <Card.Title>Pré-visualização</Card.Title>
          </Card.Header>
          <Card.Content />
            <AnalyticsPreview data={formData} / />
          </Card.Content></Card></div>);};
