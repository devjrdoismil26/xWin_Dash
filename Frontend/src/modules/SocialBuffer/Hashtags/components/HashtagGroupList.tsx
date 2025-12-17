import React from 'react';
import Card from '@/shared/components/ui/Card';
const HashtagGroupList = ({ groups = [] as unknown[] }) => (
  <Card />
    <Card.Header />
      <Card.Title>Grupos</Card.Title>
    </Card.Header>
    <Card.Content />
      <ul className="list-disc pl-5 text-sm" />
        {(groups || []).map((g: unknown) => (<li key={ g.id }>{g.name}</li>))}
        {groups.length === 0 && <li className="list-none text-gray-500">Sem grupos</li>}
      </ul>
    </Card.Content>
  </Card>);

export default HashtagGroupList;
