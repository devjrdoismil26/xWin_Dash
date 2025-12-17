import React from 'react';
import { Workflow, Play, Pause, Plus } from 'lucide-react';

export const WorkflowsIndexPage: React.FC = () => {
  const workflows = [
    { id: 1, name: 'Lead Nurturing', status: 'active', executions: 145 },
    { id: 2, name: 'Email Campaign', status: 'paused', executions: 89 },
    { id: 3, name: 'Social Posting', status: 'active', executions: 234 }
  ];

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h1 className="text-3xl font-bold flex items-center gap-2" />
          <Workflow className="w-8 h-8" />
          Workflows
        </h1>
        <button className="btn btn-primary" />
          <Plus className="w-4 h-4 mr-2" />
          Novo Workflow
        </button></div><div className="{workflows.map((wf: unknown) => (">$2</div>
          <div key={wf.id} className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
           
        </div><div>
           
        </div><h3 className="text-lg font-semibold">{wf.name}</h3>
              <p className="text-sm text-gray-600">{wf.executions} execuções</p></div><div className=" ">$2</div><span className={`px-3 py-1 rounded-full text-sm ${
                wf.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              } `}>
           
        </span>{wf.status}
              </span>
              <button className="btn btn-sm btn-secondary" />
                {wf.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
      </div>
    </>
  ))}
      </div>);};

export default WorkflowsIndexPage;
