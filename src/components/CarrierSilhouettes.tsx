import React from 'react';
import { JapaneseCarrier } from '../types';

interface CarrierSilhouetteProps {
  name: JapaneseCarrier | string;
  className?: string;
  opacity?: number;
}

export const CarrierSilhouette: React.FC<CarrierSilhouetteProps> = ({ name, className = "", opacity = 0.2 }) => {
  
  const getPath = (name: string) => {
    switch (name) {
      case 'AKAGI':
        // Distinctive: Port island (rendered here simply), massive downward funnel
        return (
          <g transform="scale(1, 1)">
            {/* Hull */}
            <path d="M20 70 L50 90 L350 90 L380 70 Z" /> 
            {/* Flight Deck */}
            <rect x="0" y="65" width="400" height="8" rx="1" />
            {/* Island (Port side - represented mid-left) */}
            <path d="M150 65 L155 45 L180 45 L180 65" />
            {/* Funnel (Starboard, curved down - represented as bulge below) */}
            <path d="M200 70 Q220 95 240 70" fill="none" stroke="currentColor" strokeWidth="3" />
          </g>
        );
      case 'KAGA':
        // Distinctive: Massive high hull, massive funnel
        return (
          <g transform="scale(1, 1)">
             <path d="M15 70 L40 95 L360 95 L385 70 Z" />
             <rect x="5" y="65" width="390" height="10" rx="1" />
             {/* Small Starboard Island */}
             <path d="M250 65 L250 50 L270 50 L265 65" />
             {/* Massive Funnel Area */}
             <path d="M180 75 L240 75" stroke="currentColor" strokeWidth="4" />
          </g>
        );
      case 'HIRYU':
        // Distinctive: Port Island
        return (
          <g transform="scale(1, 1)">
            <path d="M30 70 L60 90 L340 90 L370 70 Z" />
            <rect x="10" y="65" width="380" height="6" rx="1" />
            {/* Port Island */}
            <path d="M160 65 L160 48 L185 48 L185 65" />
            {/* Bow wave hint */}
             <path d="M370 90 L390 90" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
          </g>
        );
      case 'SORYU':
        // Distinctive: Starboard Island, sleek
        return (
          <g transform="scale(1, 1)">
            <path d="M35 70 L65 88 L335 88 L365 70 Z" />
            <rect x="15" y="65" width="370" height="6" rx="1" />
             {/* Starboard Island */}
             <path d="M220 65 L220 50 L240 50 L240 65" />
          </g>
        );
      default:
        return <rect x="0" y="60" width="400" height="20" />;
    }
  };

  return (
    <svg 
      viewBox="0 0 400 100" 
      className={className} 
      fill="currentColor"
      style={{ opacity }}
      preserveAspectRatio="xMidYMid meet"
    >
      {getPath(name as string)}
    </svg>
  );
};
