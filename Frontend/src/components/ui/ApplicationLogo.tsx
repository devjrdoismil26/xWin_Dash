import React from 'react';

const ApplicationLogo = ({ className = '', width = 120, height = 40 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="120" height="40" rx="8" fill="#3B82F6" />
    <text x="60" y="25" textAnchor="middle" className="fill-white text-lg font-bold">
      xWin Dash
    </text>
  </svg>
);

export default ApplicationLogo;
