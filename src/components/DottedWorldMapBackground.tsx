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

          {/* Flying Jet Airplane 1 */}
          <g>
            <animateMotion
              path="M 330 340 Q 250 250 240 200"
              dur="7s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <path
              d="M 0 -4 L 8 0 L 0 4 L 2 1 L -6 2 L -4 0 L -6 -2 L 2 -1 Z"
              fill="#ffffff"
              filter="url(#glow)"
            />
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

          {/* Flying Jet Airplane 2 */}
          <g>
            <animateMotion
              path="M 330 340 Q 420 220 500 130"
              dur="9s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <path
              d="M 0 -4 L 8 0 L 0 4 L 2 1 L -6 2 L -4 0 L -6 -2 L 2 -1 Z"
              fill="#fbbf24"
              filter="url(#glow)"
            />
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

          {/* Flying Jet Airplane 3 */}
          <g>
            <animateMotion
              path="M 260 150 Q 380 80 500 130"
              dur="8.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <path
              d="M 0 -4 L 8 0 L 0 4 L 2 1 L -6 2 L -4 0 L -6 -2 L 2 -1 Z"
              fill="#e0e7ff"
              filter="url(#glow)"
            />
          </g>
        </g>

        {/* --- ROUTE 4: DOMESTIC BRAZIL TRUNK (VCP -> SSA / REC) --- */}
        <g>
          <path
            d="M 330 340 Q 355 310 370 280"
            fill="none"
            stroke="#38bdf8"
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
              dur="4.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* Flying Jet Airplane 4 */}
          <g>
            <animateMotion
              path="M 330 340 Q 355 310 370 280"
              dur="4.5s"
              repeatCount="indefinite"
              rotate="auto"
            />
            <path
              d="M 0 -3 L 6 0 L 0 3 L 1 1 L -4 1.5 L -3 0 L -4 -1.5 L 1 -1 Z"
              fill="#38bdf8"
              filter="url(#glow)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
