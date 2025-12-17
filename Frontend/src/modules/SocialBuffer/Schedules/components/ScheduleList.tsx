import React from 'react';
import Card from '@/shared/components/ui/Card';
const ScheduleList = ({ items = [] as unknown[] }) => (
  <Card />
    <Card.Header />
      <Card.Title>Lista</Card.Title>
    </Card.Header>
    <Card.Content />
      <ul className="divide-y text-sm" />
        {(items || []).map((i: unknown) => (<li key={i.id} className="py-2">{i.time} — {i.title}</li>))}
        {items.length === 0 && <li className="py-6 text-center text-gray-500">Sem itens</li>}
      </ul>
    </Card.Content>
  </Card>);

export default ScheduleList;
