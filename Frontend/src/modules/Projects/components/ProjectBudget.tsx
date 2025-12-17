import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export const ProjectBudget: React.FC<{ projectId: string }> = ({ projectId    }) => {
  const budget = {
    total: 100000,
    spent: 65000,
    remaining: 35000,
    percentage: 65};

  return (
            <div className=" ">$2</div><h2 className="text-2xl font-bold mb-6 flex items-center gap-2" />
        <DollarSign className="w-6 h-6 text-green-500" />
        Orçamento do Projeto
      </h2>
      <div className=" ">$2</div><div className=" ">$2</div><p className="text-sm text-gray-600">Orçamento Total</p>
          <p className="text-2xl font-bold mt-2">R$ {budget.total.toLocaleString()}</p></div><div className=" ">$2</div><p className="text-sm text-gray-600">Gasto</p>
          <p className="text-2xl font-bold mt-2 text-red-600">R$ {budget.spent.toLocaleString()}</p></div><div className=" ">$2</div><p className="text-sm text-gray-600">Restante</p>
          <p className="text-2xl font-bold mt-2 text-green-600">R$ {budget.remaining.toLocaleString()}</p></div><div className=" ">$2</div><div className=" ">$2</div><span>Utilização</span>
          <span className="font-bold">{budget.percentage}%</span></div><div className=" ">$2</div><div className="bg-blue-600 h-4 rounded-full" style={width: `${budget.percentage} %` } / />
           
        </div></div>);};

export default ProjectBudget;
