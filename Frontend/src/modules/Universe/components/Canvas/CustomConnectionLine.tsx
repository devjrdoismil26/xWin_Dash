import React from 'react';
import { getBezierPath, EdgeProps } from 'reactflow';
const CustomConnectionLine: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style={} as any,
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getConnectionColor = () => {
    if (data?.status === 'error') return '#ef4444';
    if (data?.status === 'warning') return '#f59e0b';
    if (data?.status === 'active') return '#10b981';
    return '#3b82f6';};

  const getConnectionWidth = () => {
    if (data?.throughput && (data as any).throughput > 1000) return 4;
    if (data?.throughput && (data as any).throughput > 100) return 3;
    return 2;};

  return (
            <>
      <path
        id={ id }
        style={stroke: getConnectionColor(),
          strokeWidth: getConnectionWidth(),
          fill: 'none',
          ...style,
        } className="react-flow__edge-path"
        d={ edgePath }
        markerEnd={ markerEnd  }>
          {/* Connection Label */}
      {data?.label && (
        <text />
          <textPath
            href={`#${id}`}
            style={fontSize: 12, fill: '#374151' } startOffset="50%"
            textAnchor="middle" />
            {data.label}
          </textPath>
      </text>
    </>
  )}
      {/* Connection Status Indicator */}
      {data?.status && (
        <circle
          cx={ labelX }
          cy={ labelY }
          r={ 4 }
          fill={ getConnectionColor() }
          stroke="white"
          strokeWidth={ 2 }
        / />
      )}
      {/* Throughput Indicator */}
      {data?.throughput && (
        <circle
          cx={ labelX + 10 }
          cy={ labelY }
          r={ 3 }
          fill="#6b7280"
          opacity={ 0.7 }
        / />
      )}
    </>);};

export default CustomConnectionLine;
