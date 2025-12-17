import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';

export const LeadScoringRules: React.FC = () => {
  const [rules] = useState([]);

  return (
            <div className=" ">$2</div><h2 className="text-xl font-bold mb-4">Lead Scoring Rules</h2>
      <Card className="p-4" />
        <p className="text-gray-500">No rules configured</p></Card></div>);};

export default LeadScoringRules;
