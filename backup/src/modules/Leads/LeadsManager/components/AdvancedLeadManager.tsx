import React from 'react';
import { AdvancedLeadManagerProps } from '../types';
const AdvancedLeadManager: React.FC<AdvancedLeadManagerProps> = ({ 
  initialLeads = [], 
  products = [], 
  filters = {}, 
  pagination 
}) => {
  return (
    <div className="space-y-4">
      <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300">
        <h3 className="font-medium text-gray-900 mb-2">Leads</h3>
        <p className="text-sm text-gray-600">Total: {initialLeads.length}</p>
        {pagination && (
          <p className="text-xs text-gray-500 mt-1">
            Página {pagination.current_page} de {pagination.last_page}
          </p>
        )}
      </div>
      <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300">
        <h3 className="font-medium text-gray-900 mb-2">Produtos</h3>
        <p className="text-sm text-gray-600">Total: {products.length}</p>
        {products.length > 0 && (
          <div className="mt-2 space-y-1">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="text-xs text-gray-500">
                • {product.name}
              </div>
            ))}
            {products.length > 3 && (
              <div className="text-xs text-gray-400">
                +{products.length - 3} mais...
              </div>
            )}
          </div>
        )}
      </div>
      {Object.keys(filters).length > 0 && (
        <div className="p-4 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-700/20 rounded-xl shadow-xl shadow-blue-500/10 hover:bg-white/20 dark:hover:bg-gray-900/20 transition-all duration-300">
          <h3 className="font-medium text-gray-900 mb-2">Filtros Ativos</h3>
          <div className="space-y-1">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="text-xs text-gray-500">
                <span className="font-medium">{key}:</span> {String(value)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default AdvancedLeadManager;
