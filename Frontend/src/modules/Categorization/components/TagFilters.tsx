import React from 'react';
import PropTypes from 'prop-types';
const TagFilters = ({ value = {}, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="search">Buscar</label>
        <input
          id="search"
          className="w-full border rounded p-2"
          value={value.search || ''}
          onChange={(e) => onFilterChange?.('search', e.target.value)}
          placeholder="Nome ou descrição"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="project_id">Projeto</label>
        <select
          id="project_id"
          className="w-full border rounded p-2"
          value={value.project_id || ''}
          onChange={(e) => onFilterChange?.('project_id', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="1">Projeto 1</option>
          <option value="2">Projeto 2</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="type">Tipo</label>
        <select
          id="type"
          className="w-full border rounded p-2"
          value={value.type || ''}
          onChange={(e) => onFilterChange?.('type', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="general">Geral</option>
          <option value="priority">Prioridade</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>
  );
};
TagFilters.propTypes = {
  value: PropTypes.object,
  onFilterChange: PropTypes.func,
};
export default TagFilters;
