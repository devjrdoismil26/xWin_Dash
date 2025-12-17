import React from 'react';

const sortOptions = [
  { value: 'name', label: 'Nome' },
  { value: 'createdAt', label: 'Data de criação' },
  { value: 'size', label: 'Tamanho' },
  { value: 'type', label: 'Tipo' }
];

export const FilterSortOptions: React.FC = () => {
  return (
            <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
        <select className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={ value }>{label}</option>
          ))}
        </select></div><div>
           
        </div><label className="block text-sm font-medium text-gray-300 mb-2">Ordem</label>
        <select className="w-full px-3 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <option value="asc">Crescente</option>
          <option value="desc">Decrescente</option></select></div>);};
