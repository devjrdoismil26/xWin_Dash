import React from 'react';
interface UniverseBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const UniverseBackground: React.FC<UniverseBackgroundProps> = ({ className    }) => {
  return (
        <>
      <div className={`absolute inset-0 overflow-hidden ${className} `}>
      </div>{/* Background Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
           
        </div>{/* SVG Stars */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg" />
        {/* Constellations */}
        <g opacity="0.6" />
          {/* Big Dipper */}
          <path
            d="M200 200 L250 180 L300 200 L350 220 L400 200 L450 180 L500 200"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
         >
          {/* Orion */}
          <path
            d="M800 300 L850 280 L900 300 L950 320 L1000 300 L1050 280 L1100 300"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
         >
          {/* Cassiopeia */}
          <path
            d="M1400 150 L1450 130 L1500 150 L1550 170 L1600 150"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2,2"
          / />
        </g>
        {/* Stars */}
        {Array.from({ length: 150 }).map((_: unknown, i: unknown) => { const x = Math.random() * 1920;
          const y = Math.random() * 1080;
          const size = Math.random() * 2 + 0.5;
          const opacity = Math.random() * 0.8 + 0.2;
          return (
                    <g key={i } />
              {/* Star Glow */}
              <circle
                cx={ x }
                cy={ y }
                r={ size * 3 }
                fill="rgba(255, 255, 255, 0.1)"
                opacity={ opacity * 0.3  }>
          {/* Star Core */}
              <circle
                cx={ x }
                cy={ y }
                r={ size }
                fill="rgba(255, 255, 255, 0.8)"
                opacity={ opacity  }>
          {/* Star Points */}
              <g opacity={ opacity * 0.6 } />
                <line
                  x1={ x - size * 2 }
                  y1={ y }
                  x2={ x + size * 2 }
                  y2={ y }
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="0.5"
                / />
                <line
                  x1={ x }
                  y1={ y - size * 2 }
                  x2={ x }
                  y2={ y + size * 2 }
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="0.5"
                / />
                <line
                  x1={ x - size * 1.4 }
                  y1={ y - size * 1.4 }
                  x2={ x + size * 1.4 }
                  y2={ y + size * 1.4 }
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="0.5"
                / />
                <line
                  x1={ x + size * 1.4 }
                  y1={ y - size * 1.4 }
                  x2={ x - size * 1.4 }
                  y2={ y + size * 1.4 }
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="0.5"
                / />
              </g>);

        })}
        {/* Nebula Effects */}
        <defs />
          <radialGradient id="nebula1" cx="50%" cy="50%" r="50%" />
            <stop offset="0%" stopColor="rgba(100, 100, 100, 0.1)" / />
            <stop offset="100%" stopColor="rgba(100, 100, 100, 0)" / /></radialGradient><radialGradient id="nebula2" cx="50%" cy="50%" r="50%" />
            <stop offset="0%" stopColor="rgba(150, 150, 150, 0.08)" / />
            <stop offset="100%" stopColor="rgba(150, 150, 150, 0)" / /></radialGradient><radialGradient id="nebula3" cx="50%" cy="50%" r="50%" />
            <stop offset="0%" stopColor="rgba(200, 200, 200, 0.06)" / />
            <stop offset="100%" stopColor="rgba(200, 200, 200, 0)" / /></radialGradient></defs>
        {/* Nebula Clouds */}
        <ellipse
          cx="400"
          cy="300"
          rx="200"
          ry="150"
          fill="url(#nebula1)"
          opacity="0.4"
        / />
        <ellipse
          cx="1200"
          cy="600"
          rx="180"
          ry="120"
          fill="url(#nebula2)"
          opacity="0.3"
        / />
        <ellipse
          cx="800"
          cy="800"
          rx="160"
          ry="100"
          fill="url(#nebula3)"
          opacity="0.2"
       >
          {/* Grid Pattern */}
        <defs />
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse" />
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            / /></pattern></defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#grid)"
          opacity="0.3"
        / />
      </svg>
      {/* Animated Particles */}
      <div className="{Array.from({ length: 30 }).map((_: unknown, i: unknown) => (">$2</div>
      <div
            key={ i }
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={left: `${Math.random() * 100} %`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            } />
    </>
  ))}
        </div>
      </div>
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/20" / />);

        </div>};

export default UniverseBackground;
