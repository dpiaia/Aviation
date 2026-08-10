import React from 'react';
import { getAirlineLogo } from '../utils/airlineLogos';

interface AirlineLogoProps {
  airline: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLightBackground?: boolean;
  showName?: boolean;
  className?: string;
}

export const AirlineLogo: React.FC<AirlineLogoProps> = ({
  airline,
  size = 'md',
  isLightBackground = false,
  showName = false,
  className = '',
}) => {
  const logoInfo = getAirlineLogo(airline);

  // Logo height mapping depending on size
  const logoSizeClasses = {
    sm: 'h-5 max-w-[80px]',
    md: 'h-7 max-w-[110px]',
    lg: 'h-9 max-w-[140px]',
    xl: 'h-11 max-w-[180px]',
  };

  const containerSizes = {
    sm: 'px-2 py-1 min-w-[55px] h-7',
    md: 'px-2.5 py-1 min-w-[80px] h-9',
    lg: 'px-3 py-1.5 min-w-[110px] h-11',
    xl: 'px-4 py-2 min-w-[140px] h-14',
  };

  // If the background is ALREADY light/white:
  // Render logo directly without badge surrounding it, taking larger space for readability.
  if (isLightBackground) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <img
          src={logoInfo.logoUrl}
          alt={logoInfo.shortName}
          referrerPolicy="no-referrer"
          className={`${logoSizeClasses[size]} object-contain`}
        />
        {showName && (
          <span className="font-semibold text-slate-800 text-sm">
            {logoInfo.shortName}
          </span>
        )}
      </div>
    );
  }

  // If the background is DARK:
  // Always wrap the logo in a clean white container element.
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`bg-white rounded-md ${containerSizes[size]} flex items-center justify-center shadow-sm border border-slate-200/80 shrink-0 overflow-hidden`}>
        <img
          src={logoInfo.logoUrl}
          alt={logoInfo.shortName}
          referrerPolicy="no-referrer"
          className={`${logoSizeClasses[size]} object-contain`}
        />
      </div>
      {showName && (
        <span className="font-medium text-slate-200 text-sm">
          {logoInfo.shortName}
        </span>
      )}
    </div>
  );
};
