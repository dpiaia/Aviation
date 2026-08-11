import React from 'react';

interface DottedWorldMapBackgroundProps {
  isDarkMode?: boolean;
}

export const DottedWorldMapBackground: React.FC<DottedWorldMapBackgroundProps> = ({ isDarkMode = true }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
      {/* Radial Gradient Base Spotlight */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
        isDarkMode
          ? 'from-slate-900/60 via-[#020617]/90 to-[#020617]'
          : 'from-blue-100/50 via-slate-100/80 to-slate-50'
      }`} />

      {/* SVG Container mapped to 1000x500 aspect canvas */}
      <svg
        className={`absolute inset-0 w-full h-full ${isDarkMode ? 'opacity-45 sm:opacity-55' : 'opacity-65 sm:opacity-75'}`}
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Dotted Background Pattern */}
          <pattern
            id="dot-grid-bg"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.1" fill={isDarkMode ? '#334155' : '#cbd5e1'} opacity={isDarkMode ? '0.6' : '0.8'} />
          </pattern>

          {/* Gradients for Contrails */}
          <linearGradient id="contrail-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="contrail-amber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="70%" stopColor="#ec6726" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="contrail-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* ================= REAL AIRPLANE SVG SILHOUETTE DEFINITIONS ================= */}
          
          {/* 1. AIRPLANE: Standard Commercial Passenger Jet (e.g. A320/B737) */}
          <g id="svg-airplane">
            <path
              d="M 14 0 
                 C 12 -1.2 8 -2 2 -2.2
                 L -2 -11 C -3 -12.5 -4.5 -12.5 -5 -11
                 L -3.5 -2.2
                 L -8 -2.5
                 L -11 -7 C -11.5 -8 -12.5 -8 -13 -7
                 L -12.2 -1.5 L -14 -1 L -14 1 L -12.2 1.5
                 L -13 7 C -12.5 8 -11.5 8 -11 7
                 L -8 2.5
                 L -3.5 2.2
                 L -5 11 C -4.5 12.5 -3 12.5 -2 11
                 L 2 2.2
                 C 8 2 12 1.2 14 0 Z"
            />
            {/* Wing Engine Pods */}
            <rect x="-0.5" y="-5.5" width="4" height="1.8" rx="0.9" />
            <rect x="-0.5" y="3.7" width="4" height="1.8" rx="0.9" />
          </g>

          {/* 2. JUMBO PLANE: Widebody 4-Engine Jet (e.g. B747 / A380) */}
          <g id="svg-jumbo-plane">
            <path
              d="M 16 0 
                 C 14 -2 9 -3 3 -3.5
                 L -1 -15 C -2 -16.5 -4 -16.5 -4.8 -15
                 L -2.5 -3.5
                 L -9 -3.8
                 L -12 -9 C -12.8 -10 -14 -10 -14.5 -9
                 L -13.5 -2 L -16 -1.2 L -16 1.2 L -13.5 2
                 L -14.5 9 C -14 10 -12.8 10 -12 9
                 L -9 3.8
                 L -2.5 3.5
                 L -4.8 15 C -4 16.5 -2 16.5 -1 15
                 L 3 3.5
                 C 9 3 14 2 16 0 Z"
            />
            {/* 4 Engine Nacelles */}
            <rect x="0" y="-8" width="4.5" height="1.8" rx="0.9" />
            <rect x="-2" y="-12" width="4.5" height="1.8" rx="0.9" />
            <rect x="0" y="6.2" width="4.5" height="1.8" rx="0.9" />
            <rect x="-2" y="10.2" width="4.5" height="1.8" rx="0.9" />
          </g>

          {/* 3. BOMBER: Strategic / Delta-Wing / Concorde Jet */}
          <g id="svg-bomber">
            <path
              d="M 15 0 
                 L 7 -2.5
                 L -5 -16 C -6.5 -17.5 -8 -16.5 -7.5 -15
                 L -2.5 -6
                 L -6.5 -6
                 L -8 -8.5 L -9.5 -8.5 L -8.5 -4
                 L -11 -4 L -10 0 L -11 4
                 L -8.5 4 L -9.5 8.5 L -8 8.5
                 L -6.5 6
                 L -2.5 6
                 L -7.5 15 C -8 16.5 -6.5 17.5 -5 16
                 L 7 2.5 Z"
            />
          </g>

          {/* 4. JET PLANE: Sleek Executive / Fighter Jet */}
          <g id="svg-jet-plane">
            <path
              d="M 16 0
                 L 5 -1.5
                 L -2 -10 C -3 -11 -4.5 -10.5 -4 -9
                 L -1.5 -1.5
                 L -8 -1.8
                 L -12 -5.5 C -13 -6.5 -14 -5.5 -13.5 -4.5
                 L -12 -0.8 L -14 -0.6 L -14 0.6 L -12 0.8
                 L -13.5 4.5 C -14 5.5 -13 6.5 -12 5.5
                 L -8 1.8
                 L -1.5 1.5
                 L -4 9 C -4.5 10.5 -3 11 -2 10
                 L 5 1.5 Z"
            />
            <line x1="-3" y1="-10" x2="2" y2="-10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="-3" y1="10" x2="2" y2="10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </g>

          {/* 5. PROPELLER PLANE: Turboprop / Twin Propeller Aircraft */}
          <g id="svg-propeller-plane">
            <path
              d="M 11 0
                 C 10 -1.5 6 -2 1 -2
                 L 0 -12 C -0.5 -13 -2 -13 -2.5 -12
                 L -3 -2
                 L -7.5 -2
                 L -9.5 -6 C -10 -7 -11 -7 -11.5 -6
                 L -10.5 -0.8 L -12 -0.6 L -12 0.6 L -10.5 0.8
                 L -11.5 6 C -11 7 -10 7 -9.5 6
                 L -7.5 2
                 L -3 2
                 L -2.5 12 C -2 13 -0.5 13 0 12
                 L 1 2
                 C 6 2 10 1.5 11 0 Z"
            />
            {/* Engine Nacelles */}
            <rect x="0.5" y="-7.5" width="3" height="2.5" rx="1" />
            <rect x="0.5" y="5" width="3" height="2.5" rx="1" />
            {/* Spinning Propeller Discs */}
            <line x1="3.5" y1="-9.5" x2="3.5" y2="-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
            <line x1="3.5" y1="3" x2="3.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          </g>
        </defs>

        {/* Global Grid Overlay */}
        <rect width="1000" height="500" fill="url(#dot-grid-bg)" />

        {/* ================= CONTINENTAL DOT SILHOUETTES ================= */}
        <g fill="#475569" opacity="0.85">
          {/* SOUTH AMERICA (BR Highlighted) */}
          {/* Brazil & Surrounds */}
          <circle cx="320" cy="310" r="2.5" fill="#38bdf8" />
          <circle cx="335" cy="320" r="3" fill="#38bdf8" />
          <circle cx="345" cy="335" r="3" fill="#ec6726" />
          <circle cx="350" cy="350" r="2.8" fill="#38bdf8" />
          <circle cx="330" cy="340" r="3.5" fill="#38bdf8" />
          <circle cx="325" cy="360" r="2.5" fill="#64748b" />
          <circle cx="315" cy="380" r="2.2" fill="#64748b" />
          <circle cx="305" cy="400" r="2" fill="#64748b" />
          <circle cx="310" cy="330" r="2.5" fill="#64748b" />
          <circle cx="295" cy="320" r="2.2" fill="#64748b" />
          <circle cx="285" cy="305" r="2.2" fill="#64748b" />

          {/* NORTH AMERICA */}
          <circle cx="180" cy="140" r="2.2" />
          <circle cx="200" cy="130" r="2.5" />
          <circle cx="220" cy="150" r="3" fill="#38bdf8" />
          <circle cx="240" cy="160" r="3" fill="#38bdf8" />
          <circle cx="260" cy="170" r="2.5" />
          <circle cx="210" cy="180" r="2.8" />
          <circle cx="230" cy="190" r="3" fill="#ec6726" />
          <circle cx="250" cy="200" r="2.5" />
          <circle cx="150" cy="120" r="2" />
          <circle cx="170" cy="100" r="2.2" />
          <circle cx="280" cy="130" r="2.2" />

          {/* EUROPE */}
          <circle cx="480" cy="120" r="2.5" />
          <circle cx="500" cy="110" r="3" fill="#38bdf8" />
          <circle cx="510" cy="130" r="3" fill="#38bdf8" />
          <circle cx="520" cy="120" r="2.8" />
          <circle cx="490" cy="140" r="2.5" />
          <circle cx="530" cy="135" r="2.2" />
          <circle cx="470" cy="130" r="2" />

          {/* AFRICA */}
          <circle cx="480" cy="220" r="2.5" />
          <circle cx="500" cy="240" r="2.8" />
          <circle cx="520" cy="270" r="2.8" />
          <circle cx="530" cy="300" r="2.5" />
          <circle cx="540" cy="330" r="2.2" />
          <circle cx="490" cy="260" r="2.2" />

          {/* ASIA */}
          <circle cx="620" cy="120" r="2.5" />
          <circle cx="660" cy="140" r="2.8" />
          <circle cx="700" cy="150" r="3" />
          <circle cx="740" cy="160" r="3" />
          <circle cx="780" cy="170" r="2.8" />
          <circle cx="820" cy="180" r="2.5" />
          <circle cx="720" cy="210" r="2.5" />
          <circle cx="750" cy="240" r="2.2" />

          {/* AUSTRALIA */}
          <circle cx="820" cy="360" r="2.5" />
          <circle cx="850" cy="370" r="2.8" />
          <circle cx="880" cy="380" r="2.5" />
          <circle cx="840" cy="390" r="2.2" />
        </g>

        {/* ================= AIRPORT NODES (PULSING RINGS) ================= */}
        {/* GRU / VCP (Sao Paulo / Campinas) */}
        <g transform="translate(330, 340)">
          <circle r="4" fill="#ec6726" filter="url(#glow)" />
          <circle r="10" fill="none" stroke="#ec6726" strokeWidth="1" opacity="0.8">
            <animate attributeName="r" values="3;18" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* MIA / MCO (Florida) */}
        <g transform="translate(240, 200)">
          <circle r="3.5" fill="#38bdf8" filter="url(#glow)" />
          <circle r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.8">
            <animate attributeName="r" values="2;15" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* LIS / CDG (Europe) */}
        <g transform="translate(500, 130)">
          <circle r="3.5" fill="#38bdf8" filter="url(#glow)" />
          <circle r="8" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.8">
            <animate attributeName="r" values="2;14" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* JFK (New York) */}
        <g transform="translate(260, 150)">
          <circle r="3" fill="#a855f7" />
        </g>

        {/* ================= FLIGHT PATHS & CONTRAILS ================= */}

        {/* --- ROUTE 1: BRAZIL TO USA (GRU -> MIA) --- */}
        <g>
          {/* Base Curved Flight Route Arc */}
          <path
            id="route-br-usa"
            d="M 330 340 Q 250 250 240 200"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.3"
          />

          {/* Animated Contrail Trail Behind Plane */}
          <path
            d="M 330 340 Q 250 250 240 200"
            fill="none"
            stroke="url(#contrail-cyan)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="100 300"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="400"
              to="0"
              dur="7s"
              repeatCount="indefinite"
            />
          </path>

          {/* Flying Commercial Airplane 1 */}
          <g>
            <animateMotion
              path="M 330 340 Q 250 250 240 200"
              dur="7s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <use href="#svg-airplane" fill="#ffffff" filter="url(#glow)" />
          </g>
        </g>

        {/* --- ROUTE 2: BRAZIL TO EUROPE (GRU -> LIS) --- */}
        <g>
          <path
            id="route-br-eur"
            d="M 330 340 Q 420 220 500 130"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            opacity="0.3"
          />

          {/* Contrail Trail */}
          <path
            d="M 330 340 Q 420 220 500 130"
            fill="none"
            stroke="url(#contrail-amber)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeDasharray="120 350"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="470"
              to="0"
              dur="9s"
              repeatCount="indefinite"
            />
          </path>

          {/* Flying Jumbo Plane 2 (Boeing 747 / A380 Widebody) */}
          <g>
            <animateMotion
              path="M 330 340 Q 420 220 500 130"
              dur="9s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <use href="#svg-jumbo-plane" fill="#fbbf24" filter="url(#glow)" />
          </g>
        </g>

        {/* --- ROUTE 3: USA TO EUROPE (JFK -> CDG) --- */}
        <g>
          <path
            d="M 260 150 Q 380 80 500 130"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.25"
          />

          <path
            d="M 260 150 Q 380 80 500 130"
            fill="none"
            stroke="url(#contrail-purple)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="90 280"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="370"
              to="0"
              dur="8.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Flying Sleek Jet Plane 3 */}
          <g>
            <animateMotion
              path="M 260 150 Q 380 80 500 130"
              dur="8.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <use href="#svg-jet-plane" fill="#38bdf8" filter="url(#glow)" />
          </g>
        </g>

        {/* --- ROUTE 4: DOMESTIC BRAZIL TRUNK (VCP -> SSA / REC) --- */}
        <g>
          <path
            d="M 330 340 Q 355 310 370 280"
            fill="none"
            stroke="#34d399"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.3"
          />

          <path
            d="M 330 340 Q 355 310 370 280"
            fill="none"
            stroke="url(#contrail-cyan)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="50 150"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="200"
              to="0"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Flying Propeller Plane 4 (Turboprop ATR) */}
          <g>
            <animateMotion
              path="M 330 340 Q 355 310 370 280"
              dur="5s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <use href="#svg-propeller-plane" fill="#34d399" filter="url(#glow)" />
          </g>
        </g>

        {/* --- ROUTE 5: MIDDLE EAST TO ASIA (DXB -> HND / SIN) --- */}
        <g>
          <path
            d="M 620 210 Q 720 150 820 180"
            fill="none"
            stroke="#ec6726"
            strokeWidth="1"
            strokeDasharray="3 5"
            opacity="0.3"
          />

          <path
            d="M 620 210 Q 720 150 820 180"
            fill="none"
            stroke="url(#contrail-amber)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="80 260"
            filter="url(#glow)"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="350"
              to="0"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>

          {/* Flying Bomber / Stealth Jet 5 */}
          <g>
            <animateMotion
              path="M 620 210 Q 720 150 820 180"
              dur="8s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <use href="#svg-bomber" fill="#ec6726" filter="url(#glow)" />
          </g>
        </g>
      </svg>
    </div>
  );
};
