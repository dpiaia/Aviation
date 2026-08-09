import React from 'react';
import { motion } from 'motion/react';
import { Plane, Clock, Award, Building2 } from 'lucide-react';
import { Flight } from '../types';
import { parseDurationMinutes, formatTotalHours } from '../utils/flightAnalytics';

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
      subtext: 'registrados no histórico',
      icon: Plane,
      color: 'from-orange-500/10 to-amber-500/10 text-[#EC6726] border-[#EC6726]/20',
      iconBg: 'bg-[#EC6726] text-white',
    },
    {
      id: 'total-hours',
      title: 'Tempo em Voo',
      value: totalHoursFormatted,
      subtext: `${totalMinutes} minutos acumulados`,
      icon: Clock,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-500 border-blue-500/20',
      iconBg: 'bg-blue-600 text-white',
    },
    {
      id: 'unique-tails',
      title: 'Matrículas Distintas',
      value: uniqueTails.toString(),
      subtext: 'aeronaves físicas voadas',
      icon: Award,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20',
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'top-airline',
      title: 'Companhia Principal',
      value: topAirline,
      subtext: `${topAirlineCount} voos (${Math.round(
        (topAirlineCount / (totalFlights || 1)) * 100
      )}%)`,
      icon: Building2,
      color: 'from-purple-500/10 to-violet-500/10 text-purple-500 border-purple-500/20',
      iconBg: 'bg-purple-600 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className={`relative p-5 rounded-2xl bg-slate-900/40 border border-slate-800/90 shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md overflow-hidden group hover:border-slate-700 transition-all`}
          >
            {/* Ambient corner radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.15),transparent_60%)] pointer-events-none" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-white mt-1 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {stat.subtext}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)] shrink-0`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
