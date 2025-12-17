import React from 'react';
import { Users, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface ResourcesStatsProps {
  totalResources: number;
  allocatedHours: number;
  totalCost: number;
  utilization: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ResourcesStats: React.FC<ResourcesStatsProps> = ({ totalResources,
  allocatedHours,
  totalCost,
  utilization
   }) => (
  <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Total Recursos</p>
          <p className="text-2xl font-bold">{totalResources}</p></div><Users className="w-8 h-8 text-blue-500" /></div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Horas Alocadas</p>
          <p className="text-2xl font-bold">{allocatedHours}h</p></div><Clock className="w-8 h-8 text-green-500" /></div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Custo Total</p>
          <p className="text-2xl font-bold">R$ {totalCost.toLocaleString()}</p></div><DollarSign className="w-8 h-8 text-yellow-500" /></div><div className=" ">$2</div><div className=" ">$2</div><div>
           
        </div><p className="text-sm text-gray-600">Utilização</p>
          <p className="text-2xl font-bold">{utilization}%</p></div><TrendingUp className="w-8 h-8 text-purple-500" /></div></div>);
