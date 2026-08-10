import React from 'react';
import { motion } from 'motion/react';
import { Plane, Clock, Award, Building2, Sparkles, ShieldCheck } from 'lucide-react';
import { Flight } from '../types';
import { parseDurationMinutes, formatTotalHours } from '../utils/flightAnalytics';
import { AirlineLogo } from './AirlineLogo';

interface StatsOverviewProps {
  flights: Flight[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ flights }) => {
  // 1. Total Flights
  const totalFlights = flights.length;

  // 2. Total Flight Time
  const totalMinutes = flights.reduce(
    (acc, f) => acc + parseDurationMinutes(f.duration),
    0
  );
  const totalHoursFormatted = formatTotalHours(totalMinutes);

  // 3. Unique Aircraft Registrations
  const uniqueTails = new Set(
    flights.map((f) => f.registration).filter((r) => r && r.trim() !== '')
  ).size;

  // 4. Top Airline
  const airlineMap = new Map<string, number>();
  flights.forEach((f) => {
    if (f.airline) {
      const cleanName = f.airline.split('(')[0].trim();
      airlineMap.set(cleanName, (airlineMap.get(cleanName) || 0) + 1);
    }
  });

  let topAirline = 'N/A';
  let topAirlineCount = 0;
  airlineMap.forEach((count, name) => {
    if (count > topAirlineCount) {
      topAirlineCount = count;
      topAirline = name;
    }
  });

  const stats = [
    {
      id: 'total-flights',
      title: 'Total de Voos',
      value: totalFlights.toString(),
      unit: 'voos',
      subtext: 'registrados no histórico',
      badge: 'HISTÓRICO ATIVO',
      icon: Plane,
      accentColor: 'border-[#EC6726]/40 hover:border-[#EC6726]/70',
      glowColor: 'bg-[#EC6726]/10',
      iconBg: 'bg-[#EC6726] text-white',
      textColor: 'text-[#EC6726]',
    },
    {
      id: 'total-hours',
      title: 'Tempo em Voo',
      value: totalHoursFormatted,
      unit: '',
      subtext: `${totalMinutes.toLocaleString('pt-BR')} minutos acumulados`,
      badge: 'TEMPO TOTAL',
      icon: Clock,
      accentColor: 'border-sky-500/40 hover:border-sky-500/70',
      glowColor: 'bg-sky-500/10',
      iconBg: 'bg-sky-500 text-white',
      textColor: 'text-sky-400',
    },
    {
      id: 'unique-tails',
      title: 'Matrículas Distintas',
      value: uniqueTails.toString(),
      unit: 'aeronaves',
      subtext: 'aeronaves físicas voadas',
      badge: 'FROTA ÚNICA',
      icon: Award,
      accentColor: 'border-emerald-500/40 hover:border-emerald-500/70',
      glowColor: 'bg-emerald-500/10',
      iconBg: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-400',
    },
    {
      id: 'top-airline',
      title: 'Companhia Principal',
      value: topAirline,
      unit: '',
      subtext: `${topAirlineCount} voos (${Math.round(
        (topAirlineCount / (totalFlights || 1)) * 100
      )}% da preferência)`,
      badge: 'PREFERIDA',
      icon: Building2,
      accentColor: 'border-amber-500/40 hover:border-amber-500/70',
      glowColor: 'bg-amber-500/10',
      iconBg: 'bg-amber-500 text-white',
      textColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        const isAirlineCard = stat.id === 'top-airline' && stat.value !== 'N/A';

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -4 }}
            className={`relative p-5 rounded-2xl bg-slate-900/70 border ${stat.accentColor} shadow-[0_8px_25px_rgba(0,0,0,0.4)] backdrop-blur-xl overflow-hidden group transition-all duration-300 flex flex-col justify-between`}
          >
            {/* Ambient subtle glow background */}
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.glowColor} rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

            {/* Top Row: Eyebrow Title & Badge */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                {stat.title}
              </p>
              <span className="text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80 shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                {stat.badge}
              </span>
            </div>

            {/* Middle Row: Main Metric / Content */}
            <div className="relative z-10 my-1 flex items-center justify-between gap-3">
              {isAirlineCard ? (
                <div className="flex items-center my-1">
                  {/* White Container for Airline Logo with tooltip */}
                  <AirlineLogo
                    airline={stat.value}
                    size="lg"
                    isLightBackground={false}
                    showName={false}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <h3 className={`text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono`}>
                      {stat.value}
                    </h3>
                    {stat.unit && (
                      <span className="text-xs font-semibold text-slate-400 font-mono">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Icon Box */}
              {!isAirlineCard && (
                <div
                  className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Bottom Row: Subtext & Verification */}
            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between relative z-10 text-[11px] text-slate-400">
              <span>{stat.subtext}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
