import React from 'react';
import Card from '@/shared/components/ui/Card';
export default function ActivityDashboard() {
  const stats = [
    { label: 'Atividades Hoje', value: 12 },
    { label: 'Esta Semana', value: 54 },
    { label: 'Erros', value: 3 },
    { label: 'Usuários Ativos', value: 8 },
  ];
  const activities = [
    { id: 1, title: 'Login', description: 'Usuário fez login', created_at: '2024-01-15 10:30' },
    { id: 2, title: 'Configuração', description: 'Alterou configurações', created_at: '2024-01-15 10:25' },
  ];
  return (
            <div className=" ">$2</div><div className="{ (stats || []).map((s: unknown) => (">$2</div>
          <Card key={s.label } />
            <Card.Content />
              <div className="text-sm text-gray-600">{s.label}</div>
              <div className="text-2xl font-semibold">{s.value}</div>
            </Card.Content>
      </Card>
    </>
  ))}
      </div>
      <Card />
        <Card.Header />
          <Card.Title>Atividades Recentes</Card.Title>
        </Card.Header>
        <Card.Content />
          <ul className="divide-y" />
            {(activities || []).map((a: unknown) => (
              <li key={a.id} className="py-3" />
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">{a.description} — {a.created_at}</div>
      </li>
    </>
  ))}
          </ul>
        </Card.Content></Card></div>);

}
