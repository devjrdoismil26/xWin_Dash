import React, { useMemo, useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
export default function ActiveSessions() {
  const [loading] = useState(false);

  const sessions = useMemo(() => [
    { id: 1, is_current: true, user_agent: 'Chrome', ip_address: '127.0.0.1', last_active: '2024-01-15 10:30' },
  ], []);

  return (
            <div className=" ">$2</div><Card />
        <Card.Header />
          <Card.Title>Sessões Ativas</Card.Title>
        </Card.Header>
        <Card.Content />
          {loading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Nenhuma sessão ativa</div>
          ) : (
            <ul className="divide-y" />
              {(sessions || []).map((s: unknown) => (
                <li key={s.id} className="py-3 flex items-center justify-between" />
                  <div>
           
        </div><div className="font-medium">{s.user_agent}</div>
                    <div className="text-xs text-gray-500">{s.ip_address} — {s.last_active}</div>
                  <Button size="sm" variant="destructive">Revogar</Button>
      </li>
    </>
  ))}
            </ul>
          )}
        </Card.Content></Card></div>);

}
