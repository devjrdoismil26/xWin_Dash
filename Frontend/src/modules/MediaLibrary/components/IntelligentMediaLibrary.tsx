import React, { useState } from 'react';
import { MediaLibraryHeader } from './Intelligent/MediaLibraryHeader';
import { MediaGrid } from './Intelligent/MediaGrid';

export const IntelligentMediaLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [items] = useState([]);

  return (
            <div className=" ">$2</div><MediaLibraryHeader viewMode={viewMode} onViewChange={setViewMode} onUpload={() => {} />
      <MediaGrid items={items} onSelect={() => {} />
    </div>);};

export default IntelligentMediaLibrary;
