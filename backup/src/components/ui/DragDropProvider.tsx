import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const DragDropContextInternal = createContext({});

export const useDragDrop = () => useContext(DragDropContextInternal);

const DragDropProvider = ({ children }) => {
  return <DragDropContextInternal.Provider value={{}}>{children}</DragDropContextInternal.Provider>;
};

DragDropProvider.propTypes = { children: PropTypes.node };

export const DraggableItem = ({ children, className = '' }) => (
  <div className={className} draggable={false}>
    {children}
  </div>
);

DraggableItem.propTypes = { children: PropTypes.node, className: PropTypes.string };

export default DragDropProvider;
