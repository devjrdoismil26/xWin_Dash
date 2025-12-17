import React, { useState } from 'react';
import { WorkflowsList } from './Advanced/WorkflowsList';

export const AdvancedWorkflowDashboard: React.FC = () => {
  const [workflows] = useState([]);

  return (
            <div className=" ">$2</div><h1 className="text-2xl font-bold mb-4">Workflows Avançados</h1>
      <WorkflowsList workflows={workflows} / />
    </div>);};

export default AdvancedWorkflowDashboard;
