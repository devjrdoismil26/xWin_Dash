import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useMediaLibrarySimple } from '../hooks/useMediaLibrarySimple';
import { FilterTypeSelector } from './FilterTypeSelector';
import { FilterSortOptions } from './FilterSortOptions';

interface MediaLibraryFiltersProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const MediaLibraryFilters: React.FC<MediaLibraryFiltersProps> = ({ className = ''    }) => {
  const { searchQuery, setSearchQuery } = useMediaLibrarySimple();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
        <>
      <div className={`space-y-4 ${className} `}>
      </div><div className=" ">$2</div><div className=" ">$2</div><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={ searchQuery }
            onChange={ (e: unknown) => setSearchQuery(e.target.value) }
            placeholder="Buscar arquivos..."
            className="w-full pl-10 pr-10 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {searchQuery && (
            <button
              onClick={ () => setSearchQuery('') }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={ () => setIsExpanded(!isExpanded) }
          className="px-4 py-2 rounded-lg backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
        </button>
      </div>

      {isExpanded && (
        <div className=" ">$2</div><FilterTypeSelector / />
          <FilterSortOptions / />
        </div>
      )}
    </div>);};

export default MediaLibraryFilters;
