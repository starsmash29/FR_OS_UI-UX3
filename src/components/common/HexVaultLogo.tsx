import React from 'react';

interface HexVaultLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  version?: string;
  dotColor?: 'primary' | 'secondary';
}

export const HexVaultLogo: React.FC<HexVaultLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  version = 'v4.8.2',
  dotColor = 'primary',
}) => {
  const pixelSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 34;

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_8px_rgba(76,215,246,0.5)]"
        >
          {/* Hexagon Outer Perimeter */}
          <polygon
            points="50,2 96,28 96,86 50,113 4,86 4,28"
            fill="#070f19"
            fillOpacity="0.85"
            stroke="#4cd7f6"
            strokeWidth="4"
          />
          <polygon
            points="50,14 85,34 85,80 50,100 15,80 15,34"
            fill="none"
            stroke="#00424f"
            strokeWidth="2"
          />
          {/* Frost Snowflake Center Nodes */}
          <circle cx="50" cy="57" r="11" fill="#0c141f" stroke="#4cd7f6" strokeWidth="3" />
          <circle cx="50" cy="57" r="3" fill="#4cd7f6" />
          {/* Spokes & Hex Crystals */}
          <line x1="50" y1="46" x2="50" y2="28" stroke="#4cd7f6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="50,22 56,26 56,32 50,36 44,32 44,26" fill="#06b6d4" stroke="#4cd7f6" strokeWidth="2" />
          <line x1="50" y1="68" x2="50" y2="86" stroke="#4cd7f6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="50,80 56,84 56,90 50,94 44,90 44,84" fill="#06b6d4" stroke="#4cd7f6" strokeWidth="2" />
          <line x1="40" y1="52" x2="25" y2="43" stroke="#4cd7f6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="23,38 29,40 31,46 26,50 20,48 18,42" fill="#06b6d4" stroke="#4cd7f6" strokeWidth="2" />
          <line x1="60" y1="62" x2="75" y2="71" stroke="#4cd7f6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="77,76 71,74 69,68 74,64 80,66 82,72" fill="#06b6d4" stroke="#4cd7f6" strokeWidth="2" />
          <line x1="40" y1="62" x2="25" y2="71" stroke="#4cd7f6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="23,76 18,72 20,66 26,64 31,68 29,74" fill="#06b6d4" stroke="#4cd7f6" strokeWidth="2" />
          <line x1="60" y1="52" x2="75" y2="43" stroke="#4cd7f6" strokeWidth="3" strokeLinecap="round" />
          <polygon points="77,38 82,42 80,48 74,50 69,46 71,40" fill="#06b6d4" stroke="#4cd7f6" strokeWidth="2" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline gap-1">
          <span className="font-['Geist'] text-lg font-bold tracking-tight text-[#dbe3f2]">
            FR<span className="text-[#4cd7f6]">·</span>OS
          </span>
          {version && (
            <span className="font-mono text-[10px] text-[#bcc9cd] uppercase tracking-widest ml-1">
              {version}
            </span>
          )}
          <span
            className={`w-1.5 h-1.5 rounded-full ml-0.5 animate-pulse ${
              dotColor === 'secondary' ? 'bg-[#4edea3]' : 'bg-[#4cd7f6]'
            }`}
          />
        </div>
      )}
    </div>
  );
};
