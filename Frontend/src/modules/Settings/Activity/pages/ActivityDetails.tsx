import React from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
export default function ActivityDetails() {
  const activity = {
    id: 1,
    user: 'João Silva',
    action: 'Login',
    description: 'Usuário fez login no sistema através da interface web',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'success',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0',
    location: 'São Paulo, Brasil',};

  return (
            <div className=" ">$2</div><div className=" ">$2</div><Button variant="outline">Voltar</Button></div><Card />
        <Card.Header />
          <Card.Title>Detalhes</Card.Title>
        </Card.Header>
        <Card.Content />
          <div className=" ">$2</div><div>
           
        </div><div className="text-sm text-gray-700">Usuário</div>
              <div className="text-gray-900">{activity.user}</div>
            <div>
           
        </div><div className="text-sm text-gray-700">Ação</div>
              <div className="text-gray-900">{activity.action}</div>
            <div className=" ">$2</div><div className="text-sm text-gray-700">Descrição</div>
              <div className="text-gray-900">{activity.description}</div>
            <div>
           
        </div><div className="text-sm text-gray-700">IP</div>
              <div className="text-gray-900">{activity.ip_address}</div>
            <div>
           
        </div><div className="text-sm text-gray-700">User Agent</div>
              <div className="text-gray-900">{activity.user_agent}</div>
            <div>
           
        </div><div className="text-sm text-gray-700">Local</div>
              <div className="text-gray-900">{activity.location}</div></div></Card.Content></Card></div>);

}
