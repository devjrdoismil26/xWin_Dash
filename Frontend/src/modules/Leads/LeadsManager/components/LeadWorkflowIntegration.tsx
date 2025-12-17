import React, { useState } from 'react';
import { WorkflowTriggers } from './Workflow/WorkflowTriggers';

export const LeadWorkflowIntegration: React.FC = () => {
  const [triggers] = useState([]);

  return (
            <div className=" ">$2</div><h2 className="text-xl font-bold mb-4">Workflow Integration</h2>
      <WorkflowTriggers triggers={triggers} onAdd={() => {} />
    </div>);};

export default LeadWorkflowIntegration;
