import React from 'react';

interface NextstepLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white' | 'compact';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCompany?: boolean;
}

export const NextstepLogo: React.FC<NextstepLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showCompany = false
}) => {
  // Dimension scales
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', sub: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // The distinctive Nextstep ascending steps + upward arrow icon
  const renderIcon = () => (
    <svg
      viewBox="0 0 240 180"
      className={`${currentSize.icon} shrink-0 overflow-visible`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Navy Gradient for bottom step */}
        <linearGradient id="nsNavyGrad" x1="20" y1="160" x2="90" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B2346" />
          <stop offset="100%" stopColor="#123762" />
        </linearGradient>

        {/* Teal Petrol Gradient for middle step */}
        <linearGradient id="nsTealGrad" x1="70" y1="120" x2="150" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B5267" />
          <stop offset="60%" stopColor="#127F90" />
          <stop offset="100%" stopColor="#1B9EAB" />
        </linearGradient>

        {/* Emerald Green Gradient for top step / leaf accent */}
        <linearGradient id="nsGreenGrad" x1="130" y1="60" x2="185" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#228C6E" />
          <stop offset="60%" stopColor="#37A87E" />
          <stop offset="100%" stopColor="#4FB984" />
        </linearGradient>

        {/* Arrow Gradient: Deep Teal to Bright Cyan */}
        <linearGradient id="nsArrowGrad" x1="50" y1="155" x2="165" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0E3852" />
          <stop offset="35%" stopColor="#0C5B72" />
          <stop offset="75%" stopColor="#158D9E" />
          <stop offset="100%" stopColor="#28B3BF" />
        </linearGradient>

        {/* Drop shadow for depth */}
        <filter id="nsGlow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0D2B52" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* STEP 1: Bottom Step (Deep Navy) */}
      <path
        d="M20 148 L44 116 C48 111 55 108 62 108 L86 108 C93 108 98 113 98 120 L98 140 C98 152 86 160 74 158 C55 155 35 152 20 148 Z"
        fill="url(#nsNavyGrad)"
      />

      {/* STEP 2: Middle Step (Petrol Teal) */}
      <path
        d="M74 108 L74 76 C74 70 79 65 86 65 L132 65 C139 65 144 70 144 77 L144 108 C144 113 139 118 133 118 L86 118 C80 118 74 113 74 108 Z"
        fill="url(#nsTealGrad)"
      />

      {/* STEP 3: Top Step (Emerald Green) */}
      <path
        d="M124 65 L124 33 C124 25 131 20 139 20 L166 20 C177 20 186 28 185 39 C184 48 176 54 167 54 L144 54 C134 54 125 58 124 65 Z"
        fill="url(#nsGreenGrad)"
      />

      {/* DYNAMIC SWEEPING ARROW (Rising from bottom to north-east) */}
      {/* Curved Tail */}
      <path
        d="M52 142 C64 148 78 153 96 153 C132 153 162 126 172 90 L158 92 C154 92 151 89 152 85 L178 52 C181 48 187 49 189 53 L208 82 C210 86 207 90 203 89 L188 88 C177 128 142 165 96 165 C72 165 54 158 40 149 C37 147 38 143 42 141 L48 140 C49 140 51 141 52 142 Z"
        fill="url(#nsArrowGrad)"
        filter="url(#nsGlow)"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{renderIcon()}</div>;
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {renderIcon()}
      <div className="flex flex-col text-left">
        <div className={`flex items-baseline leading-none tracking-tight font-sans ${currentSize.text}`}>
          <span className={`font-black ${isWhite ? 'text-white' : 'text-[#0D2B52]'}`}>
            Next
          </span>
          <span className={`font-semibold ${isWhite ? 'text-teal-300' : 'text-[#3E6F9C]'}`}>
            step
          </span>
        </div>
        {showCompany && (
          <span
            className={`font-semibold tracking-wide uppercase ${currentSize.sub} mt-0.5 ${
              isWhite ? 'text-teal-100/80' : 'text-slate-500'
            }`}
          >
            Công ty Cổ phần Nextstep
          </span>
        )}
      </div>
    </div>
  );
};

export default NextstepLogo;
