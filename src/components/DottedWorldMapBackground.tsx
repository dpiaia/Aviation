import React from 'react';

export const DottedWorldMapBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020617]">
      {/* Soft gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-[#020617]/90 to-[#020617]" />

      {/* Dotted World Map Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="dotted-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="#334155" />
            <circle cx="18" cy="18" r="1.2" fill="#334155" />
          </pattern>
          <linearGradient id="flight-glow-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flight-glow-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dotted Canvas */}
        <rect width="100%" height="100%" fill="url(#dotted-grid)" />

        {/* Continental Dot Matrix Hints (World Map silhouette dots) */}
        <g fill="#475569" opacity="0.4">
          {/* South America cluster */}
          <circle cx="32%" cy="65%" r="2" />
          <circle cx="34%" cy="62%" r="2.5" />
          <circle cx="35%" cy="68%" r="2" />
          <circle cx="33%" cy="72%" r="1.8" />
          <circle cx="31%" cy="60%" r="2.2" />

          {/* North America cluster */}
          <circle cx="22%" cy="32%" r="2" />
          <circle cx="25%" cy="28%" r="2.5" />
          <circle cx="28%" cy="35%" r="2" />

          {/* Europe cluster */}
          <circle cx="50%" cy="26%" r="2" />
          <circle cx="52%" cy="28%" r="2.5" />
          <circle cx="48%" cy="30%" r="2" />

          {/* Africa cluster */}
          <circle cx="52%" cy="52%" r="2" />
          <circle cx="55%" cy="58%" r="2" />

          {/* Asia cluster */}
          <circle cx="70%" cy="35%" r="2.5" />
          <circle cx="75%" cy="40%" r="2" />
        </g>

        {/* Subtle Animated Flight Beams Across the Globe */}
        <g opacity="0.6">
          {/* Brazil -> Europe trajectory */}
          <path
            d="M 330 420 Q 430 250 510 210"
            fill="none"
            stroke="url(#flight-glow-1)"
            strokeWidth="1.5"
            strokeDasharray="12 120"
            className="animate-pulse"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="200"
              to="-200"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>

          {/* Brazil -> USA trajectory */}
          <path
            d="M 340 430 Q 280 320 250 220"
            fill="none"
            stroke="url(#flight-glow-2)"
            strokeWidth="1.5"
            strokeDasharray="10 100"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="250"
              to="-250"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>

          {/* Domestic South-East trajectory */}
          <path
            d="M 320 440 Q 340 450 350 460"
            fill="none"
            stroke="url(#flight-glow-1)"
            strokeWidth="1.2"
            strokeDasharray="8 60"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="-100"
              dur="4s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
};
