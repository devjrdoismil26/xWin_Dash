import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';

export const ProjectRisks: React.FC<{ projectId: string }> = ({ projectId    }) => {
  const [risks, setRisks] = useState([]);

  return (
            <div className=" ">$2</div><div className=" ">$2</div><h2 className="text-2xl font-bold flex items-center gap-2" />
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          Riscos do Projeto
        </h2>
        <button className="btn btn-primary" />
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Risco
        </button></div><div className=" ">$2</div><p className="text-gray-600">Nenhum risco identificado</p>
      </div>);};

export default ProjectRisks;
