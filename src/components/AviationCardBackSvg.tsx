import React from 'react';
import { CardCategory } from '../data/albumCards';

interface AviationCardBackSvgProps {
  category: CardCategory;
  className?: string;
  idSuffix?: string;
}

// Category color palettes for gradients and elements
interface CategoryPalette {
  bgStart: string;
  bgMid: string;
  bgEnd: string;
  gold1_0: string;
  gold1_35: string;
  gold1_70: string;
  gold1_100: string;
  gold2_0: string;
  gold2_50: string;
  gold2_100: string;
  innerCenterBg: string;
  centerMedallionBg: string;
}

const CATEGORY_PALETTES: Record<CardCategory, CategoryPalette> = {
  AIRPORT: {
    // Nautical Navy Blue / Aviation Blue & Cyan Gold
    bgStart: '#0f2744',
    bgMid: '#091829',
    bgEnd: '#040b14',
    gold1_0: '#ccebff',
    gold1_35: '#38bdf8',
    gold1_70: '#0284c7',
    gold1_100: '#7dd3fc',
    gold2_0: '#0284c7',
    gold2_50: '#e0f2fe',
    gold2_100: '#0369a1',
    innerCenterBg: '#082f49',
    centerMedallionBg: '#0c1e33',
  },
  AIRCRAFT_MODEL: {
    // Warm Classic Vintage Gold & Obsidian
    bgStart: '#201a14',
    bgMid: '#14100c',
    bgEnd: '#090705',
    gold1_0: '#fcedb3',
    gold1_35: '#d4af37',
    gold1_70: '#aa8214',
    gold1_100: '#dfbe57',
    gold2_0: '#d4af37',
    gold2_50: '#fff2c2',
    gold2_100: '#9a7412',
    innerCenterBg: '#1c1610',
    centerMedallionBg: '#14100c',
  },
  SPECIFIC_AIRCRAFT: {
    // Clinicorp Signature Orange & Amber Flame
    bgStart: '#2a140a',
    bgMid: '#180c05',
    bgEnd: '#0a0502',
    gold1_0: '#ffedd5',
    gold1_35: '#f97316',
    gold1_70: '#ea580c',
    gold1_100: '#fb923c',
    gold2_0: '#f97316',
    gold2_50: '#fed7aa',
    gold2_100: '#c2410c',
    innerCenterBg: '#341508',
    centerMedallionBg: '#1f0d05',
  },
  LEGENDARY_AIRCRAFT: {
    // Royal Titanium Black & 24K Pure Gold
    bgStart: '#1c1917',
    bgMid: '#0c0a09',
    bgEnd: '#000000',
    gold1_0: '#fffbeb',
    gold1_35: '#f59e0b',
    gold1_70: '#b45309',
    gold1_100: '#fbbf24',
    gold2_0: '#d97706',
    gold2_50: '#fef3c7',
    gold2_100: '#78350f',
    innerCenterBg: '#1a1307',
    centerMedallionBg: '#090704',
  },
};

export const AviationCardBackSvg: React.FC<AviationCardBackSvgProps> = ({
  category,
  className = '',
  idSuffix = 'default',
}) => {
  const p = CATEGORY_PALETTES[category] || CATEGORY_PALETTES.AIRCRAFT_MODEL;
  const uid = `${category}_${idSuffix}`;

  const bgGradId = `bgGrad_${uid}`;
  const goldGrad1Id = `goldGrad1_${uid}`;
  const goldGrad2Id = `goldGrad2_${uid}`;
  const concordeId = `concorde_${uid}`;
  const b747Id = `b747_${uid}`;
  const fighterId = `fighter_${uid}`;
  const vintageId = `vintage_${uid}`;
  const cornerOrnamentId = `cornerOrnament_${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 750 1050"
      className={`w-full h-full block ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Background Radial Gradient */}
        <radialGradient id={bgGradId} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor={p.bgStart} />
          <stop offset="70%" stopColor={p.bgMid} />
          <stop offset="100%" stopColor={p.bgEnd} />
        </radialGradient>

        {/* Primary Accent Gradient */}
        <linearGradient id={goldGrad1Id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.gold1_0} />
          <stop offset="35%" stopColor={p.gold1_35} />
          <stop offset="70%" stopColor={p.gold1_70} />
          <stop offset="100%" stopColor={p.gold1_100} />
        </linearGradient>

        {/* Secondary Accent Gradient */}
        <linearGradient id={goldGrad2Id} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={p.gold2_0} />
          <stop offset="50%" stopColor={p.gold2_50} />
          <stop offset="100%" stopColor={p.gold2_100} />
        </linearGradient>

        {/* 1. Concorde */}
        <g id={concordeId}>
          <path
            d="M 0,-190 
               C 2,-160 4,-100 5,-30 
               L 42,-5 
               C 44,5 42,20 40,25 
               L 8,18 
               L 8,40 
               L 3,45 
               L 0,43 
               L -3,45 
               L -8,40 
               L -8,18 
               L -40,25 
               C -42,20 -44,5 -42,-5 
               L -5,-30 
               C -4,-100 -2,-160 0,-190 Z"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line
            x1="0"
            y1="-185"
            x2="0"
            y2="40"
            stroke={`url(#${goldGrad2Id})`}
            strokeWidth="1.2"
            strokeDasharray="8,4"
          />
          <path
            d="M 0,-130 Q 3,-80 20,5 M 0,-130 Q -3,-80 -20,5"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1"
            opacity="0.7"
          />
          <rect
            x="14"
            y="10"
            width="7"
            height="18"
            rx="2"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <rect
            x="-21"
            y="10"
            width="7"
            height="18"
            rx="2"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
        </g>

        {/* 2. Boeing 747 */}
        <g id={b747Id}>
          <path
            d="M 0,-175 
               C 6,-155 7,-120 7,-40 
               L 75,5 
               L 73,20 
               L 8,3 
               L 8,45 
               L 30,62 
               L 28,70 
               L 0,65 
               L -28,70 
               L -30,62 
               L -8,45 
               L -8,3 
               L -73,20 
               L -75,5 
               L -7,-40 
               C -7,-120 -6,-155 0,-175 Z"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line
            x1="0"
            y1="-170"
            x2="0"
            y2="60"
            stroke={`url(#${goldGrad2Id})`}
            strokeWidth="1.2"
            strokeDasharray="6,4"
          />
          <ellipse
            cx="0"
            cy="-115"
            rx="3.5"
            ry="15"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.2"
          />
          <rect
            x="25"
            y="-10"
            width="5.5"
            height="15"
            rx="2"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <rect
            x="45"
            y="3"
            width="5.5"
            height="14"
            rx="2"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <rect
            x="-30.5"
            y="-10"
            width="5.5"
            height="15"
            rx="2"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <rect
            x="-50.5"
            y="3"
            width="5.5"
            height="14"
            rx="2"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
        </g>

        {/* 3. Modern Military Fighter */}
        <g id={fighterId}>
          <path
            d="M 0,-175 
               L 4,-145 
               L 12,-125 
               L 6,-110 
               L 6,-50 
               L 52,10 
               L 48,22 
               L 22,12 
               L 26,45 
               L 18,52 
               L 6,38 
               L 4,50 
               L 0,48 
               L -4,50 
               L -6,38 
               L -18,52 
               L -26,45 
               L -22,12 
               L -48,22 
               L -52,10 
               L -6,-50 
               L -6,-110 
               L -12,-125 
               L -4,-145 Z"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="0,-140 3,-105 0,-95 -3,-105"
            fill="none"
            stroke={`url(#${goldGrad2Id})`}
            strokeWidth="1.3"
          />
          <line
            x1="0"
            y1="-95"
            x2="0"
            y2="45"
            stroke={`url(#${goldGrad2Id})`}
            strokeWidth="1.2"
            strokeDasharray="5,3"
          />
          <line
            x1="12"
            y1="10"
            x2="16"
            y2="40"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.8"
          />
          <line
            x1="-12"
            y1="10"
            x2="-16"
            y2="40"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.8"
          />
        </g>

        {/* 4. Vintage Monoplane */}
        <g id={vintageId}>
          <ellipse
            cx="0"
            cy="-175"
            rx="16"
            ry="3.5"
            fill="none"
            stroke={`url(#${goldGrad2Id})`}
            strokeWidth="1.5"
          />
          <circle cx="0" cy="-175" r="2.5" fill={`url(#${goldGrad1Id})`} />
          <path
            d="M 0,-172 
               C 6,-165 7,-140 7,-40 
               L 68,-40 
               C 74,-38 74,-22 68,-20 
               L 6,-15 
               L 4,38 
               L 22,50 
               L 20,57 
               L 0,53 
               L -20,57 
               L -22,50 
               L -4,38 
               L -6,-15 
               L -68,-20 
               C -74,-22 -74,-38 -68,-40 
               L -7,-40 
               C -7,-140 -6,-165 0,-172 Z"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle
            cx="0"
            cy="-60"
            r="5"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <line
            x1="-55"
            y1="-38"
            x2="-55"
            y2="-22"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1"
            opacity="0.8"
          />
          <line
            x1="-35"
            y1="-39"
            x2="-35"
            y2="-20"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1"
            opacity="0.8"
          />
          <line
            x1="55"
            y1="-38"
            x2="55"
            y2="-22"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1"
            opacity="0.8"
          />
          <line
            x1="35"
            y1="-39"
            x2="35"
            y2="-20"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1"
            opacity="0.8"
          />
          <line
            x1="-12"
            y1="-70"
            x2="-18"
            y2="-55"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <line
            x1="12"
            y1="-70"
            x2="18"
            y2="-55"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
        </g>

        {/* Corner Filigree */}
        <g id={cornerOrnamentId}>
          <path
            d="M 45,45 L 140,45 A 5,5 0 0 1 145,50 L 145,52 A 5,5 0 0 1 140,57 L 57,57 L 57,140 A 5,5 0 0 1 52,145 L 50,145 A 5,5 0 0 1 45,140 Z"
            fill={`url(#${goldGrad1Id})`}
            opacity="0.85"
          />
          <circle
            cx="75"
            cy="75"
            r="14"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.5"
          />
          <path
            d="M 75,55 L 75,95 M 55,75 L 95,75"
            stroke={`url(#${goldGrad2Id})`}
            strokeWidth="1"
          />
          <polygon points="75,64 78,75 75,73 72,75" fill={`url(#${goldGrad1Id})`} />
          <polygon points="75,86 78,75 75,77 72,75" fill={`url(#${goldGrad1Id})`} />
          <polygon points="64,75 75,78 73,75 75,72" fill={`url(#${goldGrad1Id})`} />
          <polygon points="86,75 75,78 77,75 75,72" fill={`url(#${goldGrad1Id})`} />
          <path
            d="M 60,60 C 85,90 100,65 130,65"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.2"
          />
          <path
            d="M 60,60 C 90,85 65,100 65,130"
            fill="none"
            stroke={`url(#${goldGrad1Id})`}
            strokeWidth="1.2"
          />
        </g>
      </defs>

      {/* Solid Opaque Background Base */}
      <rect x="0" y="0" width="750" height="1050" rx="35" ry="35" fill={`url(#${bgGradId})`} />

      {/* Outer Borders */}
      <rect
        x="25"
        y="25"
        width="700"
        height="1000"
        rx="25"
        ry="25"
        fill="none"
        stroke={`url(#${goldGrad1Id})`}
        strokeWidth="2"
      />
      <rect
        x="35"
        y="35"
        width="680"
        height="980"
        rx="20"
        ry="20"
        fill="none"
        stroke={`url(#${goldGrad2Id})`}
        strokeWidth="1"
        strokeDasharray="6,4"
        opacity="0.6"
      />
      <rect
        x="45"
        y="45"
        width="660"
        height="960"
        rx="15"
        ry="15"
        fill="none"
        stroke={`url(#${goldGrad1Id})`}
        strokeWidth="3"
      />

      {/* Radar Lines */}
      <g opacity="0.12" stroke={`url(#${goldGrad2Id})`} strokeWidth="1" fill="none">
        <circle cx="375" cy="525" r="480" />
        <circle cx="375" cy="525" r="420" />
        <circle cx="375" cy="525" r="360" />
        <circle cx="375" cy="525" r="300" />
        <circle cx="375" cy="525" r="240" />
        <circle cx="375" cy="525" r="180" />
        <circle cx="375" cy="525" r="120" />
        <circle cx="375" cy="525" r="60" />
        <line x1="375" y1="45" x2="375" y2="1005" />
        <line x1="45" y1="525" x2="705" y2="525" />
        <line x1="45" y1="45" x2="705" y2="1005" />
        <line x1="705" y1="45" x2="45" y2="1005" />
      </g>

      {/* 4 Corner Flourishes */}
      <use href={`#${cornerOrnamentId}`} />
      <use href={`#${cornerOrnamentId}`} transform="translate(750, 0) scale(-1, 1)" />
      <use href={`#${cornerOrnamentId}`} transform="translate(0, 1050) scale(1, -1)" />
      <use href={`#${cornerOrnamentId}`} transform="translate(750, 1050) scale(-1, -1)" />

      {/* Runway Strips */}
      <g opacity="0.5">
        <rect
          x="361"
          y="70"
          width="28"
          height="910"
          fill="none"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1"
        />
        <line
          x1="375"
          y1="75"
          x2="375"
          y2="975"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2.5"
          strokeDasharray="25,20"
        />
        <path
          d="M 364,80 L 386,80 M 364,86 L 386,86 M 364,92 L 386,92 M 364,98 L 386,98"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2"
        />
        <path
          d="M 364,970 L 386,970 M 364,964 L 386,964 M 364,958 L 386,958 M 364,952 L 386,952"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2"
        />
      </g>

      <g opacity="0.5">
        <rect
          x="70"
          y="511"
          width="610"
          height="28"
          fill="none"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1"
        />
        <line
          x1="75"
          y1="525"
          x2="675"
          y2="525"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2.5"
          strokeDasharray="25,20"
        />
        <path
          d="M 80,514 L 80,536 M 86,514 L 86,536 M 92,514 L 92,536 M 98,514 L 98,536"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2"
        />
        <path
          d="M 670,514 L 670,536 M 664,514 L 664,536 M 658,514 L 658,536 M 652,514 L 652,536"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2"
        />
      </g>

      {/* Compass Ring Network */}
      <circle
        cx="375"
        cy="525"
        r="235"
        fill="none"
        stroke={`url(#${goldGrad1Id})`}
        strokeWidth="1.5"
        strokeDasharray="4,8"
        opacity="0.6"
      />
      <circle
        cx="375"
        cy="525"
        r="215"
        fill="none"
        stroke={`url(#${goldGrad1Id})`}
        strokeWidth="1"
        opacity="0.5"
      />
      <circle
        cx="375"
        cy="525"
        r="145"
        fill="none"
        stroke={`url(#${goldGrad2Id})`}
        strokeWidth="2"
        opacity="0.8"
      />

      {/* 4 Aircraft */}
      {/* 1. Concorde (North) */}
      <g transform="translate(375, 290)">
        <line
          x1="0"
          y1="50"
          x2="0"
          y2="135"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.8"
          strokeDasharray="10,6"
          opacity="0.75"
        />
        <line
          x1="-17"
          y1="35"
          x2="-26"
          y2="125"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <line
          x1="17"
          y1="35"
          x2="26"
          y2="125"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <use href={`#${concordeId}`} />
        <text
          x="0"
          y="-198"
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif"
          fontSize="11"
          fill={`url(#${goldGrad1Id})`}
          letterSpacing="4"
          textAnchor="middle"
          fontWeight="bold"
        >
          CONCORDE
        </text>
      </g>

      {/* 2. Boeing 747 (East) */}
      <g transform="translate(600, 525) rotate(90)">
        <line
          x1="0"
          y1="75"
          x2="0"
          y2="160"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.8"
          strokeDasharray="10,6"
          opacity="0.75"
        />
        <line
          x1="-28"
          y1="20"
          x2="-40"
          y2="150"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <line
          x1="28"
          y1="20"
          x2="40"
          y2="150"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <use href={`#${b747Id}`} />
        <text
          x="0"
          y="-185"
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif"
          fontSize="11"
          fill={`url(#${goldGrad1Id})`}
          letterSpacing="4"
          textAnchor="middle"
          fontWeight="bold"
        >
          B-747
        </text>
      </g>

      {/* 3. Fighter (South) */}
      <g transform="translate(375, 760) rotate(180)">
        <line
          x1="0"
          y1="55"
          x2="0"
          y2="140"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.8"
          strokeDasharray="10,6"
          opacity="0.75"
        />
        <line
          x1="-15"
          y1="40"
          x2="-22"
          y2="130"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <line
          x1="15"
          y1="40"
          x2="22"
          y2="130"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <use href={`#${fighterId}`} />
        <text
          x="0"
          y="-185"
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif"
          fontSize="11"
          fill={`url(#${goldGrad1Id})`}
          letterSpacing="4"
          textAnchor="middle"
          fontWeight="bold"
        >
          FIGHTER
        </text>
      </g>

      {/* 4. Vintage Monoplane (West) */}
      <g transform="translate(150, 525) rotate(270)">
        <line
          x1="0"
          y1="65"
          x2="0"
          y2="150"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.8"
          strokeDasharray="10,6"
          opacity="0.75"
        />
        <line
          x1="-20"
          y1="45"
          x2="-30"
          y2="140"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <line
          x1="20"
          y1="45"
          x2="30"
          y2="140"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.2"
          strokeDasharray="6,6"
          opacity="0.5"
        />
        <use href={`#${vintageId}`} />
        <text
          x="0"
          y="-185"
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif"
          fontSize="11"
          fill={`url(#${goldGrad1Id})`}
          letterSpacing="4"
          textAnchor="middle"
          fontWeight="bold"
        >
          CLASSIC
        </text>
      </g>

      {/* Central Medallion */}
      <g transform="translate(375, 525)">
        <circle
          cx="0"
          cy="0"
          r="102"
          fill={p.centerMedallionBg}
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="3.5"
        />
        <circle
          cx="0"
          cy="0"
          r="94"
          fill="none"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.5"
          strokeDasharray="5,3"
        />

        {/* Azimuth Ticks */}
        <g stroke={`url(#${goldGrad1Id})`} strokeWidth="1" opacity="0.8">
          <line x1="0" y1="-94" x2="0" y2="-84" strokeWidth="2" />
          <line x1="0" y1="94" x2="0" y2="84" strokeWidth="2" />
          <line x1="-94" y1="0" x2="-84" y2="0" strokeWidth="2" />
          <line x1="94" y1="0" x2="84" y2="0" strokeWidth="2" />
          <line x1="66.5" y1="66.5" x2="59.4" y2="59.4" strokeWidth="1.5" />
          <line x1="-66.5" y1="66.5" x2="-59.4" y2="59.4" strokeWidth="1.5" />
          <line x1="66.5" y1="-66.5" x2="59.4" y2="-59.4" strokeWidth="1.5" />
          <line x1="-66.5" y1="-66.5" x2="-59.4" y2="-59.4" strokeWidth="1.5" />
        </g>

        {/* Aviator Wing Insignia */}
        <g fill="none" stroke={`url(#${goldGrad1Id})`} strokeWidth="1.5" opacity="0.75">
          <path d="M -25,-15 C -45,-30 -75,-25 -95,-10 C -75,-5 -50,-5 -25,0 Z" />
          <path d="M -25,0 C -50,5 -75,5 -90,15 C -70,18 -45,15 -25,10 Z" />
          <path d="M 25,-15 C 45,-30 75,-25 95,-10 C 75,-5 50,-5 25,0 Z" />
          <path d="M 25,0 C 50,5 75,5 90,15 C 70,18 45,15 25,10 Z" />
        </g>

        {/* Inner Runway Ring */}
        <circle
          cx="0"
          cy="0"
          r="62"
          fill={p.innerCenterBg}
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="2"
        />
        <rect
          x="-8"
          y="-55"
          width="16"
          height="110"
          fill={p.centerMedallionBg}
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1"
        />
        <rect
          x="-55"
          y="-8"
          width="110"
          height="16"
          fill={p.centerMedallionBg}
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="-50"
          x2="0"
          y2="50"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.5"
          strokeDasharray="8,6"
        />
        <line
          x1="-50"
          y1="0"
          x2="50"
          y2="0"
          stroke={`url(#${goldGrad1Id})`}
          strokeWidth="1.5"
          strokeDasharray="8,6"
        />

        {/* 8-Point Compass Star */}
        <g>
          <polygon points="0,-48 6,-14 0,0" fill={`url(#${goldGrad1Id})`} />
          <polygon points="0,-48 -6,-14 0,0" fill={`url(#${goldGrad2Id})`} />
          <polygon points="0,48 6,14 0,0" fill={`url(#${goldGrad2Id})`} />
          <polygon points="0,48 -6,14 0,0" fill={`url(#${goldGrad1Id})`} />
          <polygon points="48,0 14,6 0,0" fill={`url(#${goldGrad1Id})`} />
          <polygon points="48,0 14,-6 0,0" fill={`url(#${goldGrad2Id})`} />
          <polygon points="-48,0 -14,6 0,0" fill={`url(#${goldGrad2Id})`} />
          <polygon points="-48,0 -14,-6 0,0" fill={`url(#${goldGrad1Id})`} />

          <polygon points="28,-28 10,-3 0,0" fill={`url(#${goldGrad2Id})`} opacity="0.9" />
          <polygon points="28,-28 3,-10 0,0" fill={`url(#${goldGrad1Id})`} opacity="0.9" />
          <polygon points="-28,-28 -10,-3 0,0" fill={`url(#${goldGrad1Id})`} opacity="0.9" />
          <polygon points="-28,-28 -3,-10 0,0" fill={`url(#${goldGrad2Id})`} opacity="0.9" />
          <polygon points="28,28 10,3 0,0" fill={`url(#${goldGrad1Id})`} opacity="0.9" />
          <polygon points="28,28 3,10 0,0" fill={`url(#${goldGrad2Id})`} opacity="0.9" />
          <polygon points="-28,28 -10,3 0,0" fill={`url(#${goldGrad2Id})`} opacity="0.9" />
          <polygon points="-28,28 -3,10 0,0" fill={`url(#${goldGrad1Id})`} opacity="0.9" />
        </g>

        {/* Center Jewel */}
        <circle cx="0" cy="0" r="7" fill={`url(#${goldGrad1Id})`} />
        <circle cx="0" cy="0" r="3.5" fill={p.centerMedallionBg} />
        <circle cx="0" cy="0" r="1.5" fill={`url(#${goldGrad2Id})`} />

        {/* Cardinal Letters */}
        <text
          x="0"
          y="-70"
          fontFamily="'Cinzel', 'Georgia', serif"
          fontSize="12"
          fill={`url(#${goldGrad1Id})`}
          fontWeight="bold"
          textAnchor="middle"
        >
          N
        </text>
        <text
          x="75"
          y="4"
          fontFamily="'Cinzel', 'Georgia', serif"
          fontSize="12"
          fill={`url(#${goldGrad1Id})`}
          fontWeight="bold"
          textAnchor="middle"
        >
          E
        </text>
        <text
          x="0"
          y="78"
          fontFamily="'Cinzel', 'Georgia', serif"
          fontSize="12"
          fill={`url(#${goldGrad1Id})`}
          fontWeight="bold"
          textAnchor="middle"
        >
          S
        </text>
        <text
          x="-75"
          y="4"
          fontFamily="'Cinzel', 'Georgia', serif"
          fontSize="12"
          fill={`url(#${goldGrad1Id})`}
          fontWeight="bold"
          textAnchor="middle"
        >
          W
        </text>
      </g>

      {/* Banners */}
      <g transform="translate(375, 135)">
        <text
          x="0"
          y="0"
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif"
          fontSize="14"
          fill={`url(#${goldGrad1Id})`}
          letterSpacing="8"
          textAnchor="middle"
          fontWeight="bold"
        >
          ★ FLYDIARY TCG ★
        </text>
        <path
          d="M -130,-5 L -65,-5 M 65,-5 L 130,-5"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.2"
        />
      </g>

      <g transform="translate(375, 915) rotate(180)">
        <text
          x="0"
          y="0"
          fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif"
          fontSize="14"
          fill={`url(#${goldGrad1Id})`}
          letterSpacing="8"
          textAnchor="middle"
          fontWeight="bold"
        >
          ★ FLYDIARY TCG ★
        </text>
        <path
          d="M -130,-5 L -65,-5 M 65,-5 L 130,-5"
          stroke={`url(#${goldGrad2Id})`}
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
};
