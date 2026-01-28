import React from 'react';
const NodeRedConnectionStatus = ({ status = 'disconnected' }) => (
  <div className={`text-sm ${status === 'connected' ? 'text-green-600' : 'text-gray-600'}`}>Node-RED: {status}</div>
);
export default NodeRedConnectionStatus;
