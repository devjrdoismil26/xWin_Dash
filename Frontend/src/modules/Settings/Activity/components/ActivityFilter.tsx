import React from 'react';

interface ActivityFilters {
  user?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string; }

interface ActivityFilterProps {
  filters?: ActivityFilters;
  onFiltersChange??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export function ActivityFilter({ filters = {} as any, onFiltersChange }: ActivityFilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange?.({ ...filters, [key]: value });};

  return (
            <div className=" ">$2</div><h3 className="text-lg font-semibold mb-4">🔍 Filters</h3>
      <div className=" ">$2</div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2">User</label>
          <input
            type="text"
            value={ filters.user || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('user', e.target.value) }
            placeholder="Filter by user..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
          <select
            value={ filters.action || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('action', e.target.value) }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="error">Error</option></select></div>
        <div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <input
            type="date"
            value={ filters.dateFrom || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('dateFrom', e.target.value) }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div><div>
           
        </div><label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <input
            type="date"
            value={ filters.dateTo || '' }
            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('dateTo', e.target.value) }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div></div>);

}
export default ActivityFilter;
