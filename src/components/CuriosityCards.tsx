import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Plane, Compass, Calendar, ArrowRight, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { Flight } from '../types';
import {
  computeTopRegistrations,
  computeFlightRecords,
  computeAircraftAgeStats,
} from '../utils/aircraftRegistrationData';
import { PlanespottersPhoto } from './PlanespottersPhoto';

interface CuriosityCardsProps {
  flights: Flight[];
}

export const CuriosityCards: React.FC<CuriosityCardsProps> = ({ flights }) => {
  const topRegistrations = computeTopRegistrations(flights);
  const flightRecords = computeFlightRecords(flights);
  const aircraftAges = computeAircraftAgeStats(flights);

  return (
    <section className="mb-10 space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Curiosidades & Recordes de Voo
          </h2>
          <p className="text-xs text-slate-400">
            Destaques por matrícula/prefixo, distâncias extremas e histórico de idade da frota
          </p>
        </div>
      </div>

      {/* ROW 1: Top 3 Most Flown Aircraft by Registration */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            1. Aeronaves Mais Voadas (Por Prefixo / Matrícula)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRegistrations.map((item, idx) => {
            const rankColors = [
              { border: 'border-amber-500/40 bg-amber-500/10 text-amber-400', badge: 'amber' as const, glow: 'shadow-[0_0_20px_rgba(245,158,11,0.12)]' },
              { border: 'border-blue-500/40 bg-blue-500/10 text-blue-400', badge: 'blue' as const, glow: 'shadow-[0_0_20px_rgba(59,130,246,0.12)]' },
              { border: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400', badge: 'cyan' as const, glow: 'shadow-[0_0_20px_rgba(6,182,212,0.12)]' },
            ][idx] || { border: 'border-slate-800 bg-slate-900/40 text-slate-300', badge: 'blue' as const, glow: '' };

            return (
              <motion.div
                key={item.registration}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className={`p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between relative overflow-hidden backdrop-blur-md ${rankColors.glow}`}
              >
                <div>
                  {/* Photo Component with Planespotters API integration */}
                  <PlanespottersPhoto
                    registration={item.registration}
                    aircraftModel={item.rawAircraft}
                    airline={item.airline}
                    badgeColor={rankColors.badge}
                    badgeLabel={`Top #${idx + 1}`}
                    className="h-40 w-full mb-3"
                  />

                  {/* Header info */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                      {item.manufacturer}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-extrabold border ${rankColors.border}`}>
                      #{idx + 1} • {item.registration}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-tight mb-1">
                    {item.model}
                  </h4>

                  <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    {item.airline}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Total de Voos</span>
                    <span className="text-sm font-black text-amber-400 font-mono">
                      {item.count} voos
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Distância Aprox.</span>
                    <span className="text-sm font-black text-blue-400 font-mono">
                      {item.totalDistanceKm.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ROW 2: Flight Distance Records */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            2. Recordes de Distância e Duração de Voo
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flightRecords.map((rec, idx) => {
            const badgeTheme = [
              { color: 'rose' as const, label: 'Internacional', border: 'border-rose-500/40 text-rose-300' },
              { color: 'emerald' as const, label: 'Nacional', border: 'border-emerald-500/40 text-emerald-300' },
              { color: 'cyan' as const, label: 'Mais Curto', border: 'border-cyan-500/40 text-cyan-300' },
            ][idx];

            return (
              <motion.div
                key={rec.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
              >
                <div>
                  <PlanespottersPhoto
                    registration={rec.flight.registration}
                    aircraftModel={rec.flight.aircraft}
                    airline={rec.flight.airline}
                    badgeColor={badgeTheme.color}
                    badgeLabel={badgeTheme.label}
                    className="h-40 w-full mb-3"
                  />

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-400">
                      {rec.title}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {rec.flight.date}
                    </span>
                  </div>

                  {/* Route Pill */}
                  <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-3">
                    <div>
                      <span className="text-sm font-black text-white font-mono">{rec.fromIata}</span>
                      <span className="block text-[10px] text-slate-400">{rec.fromCity}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                    <div className="text-right">
                      <span className="text-sm font-black text-white font-mono">{rec.toIata}</span>
                      <span className="block text-[10px] text-slate-400">{rec.toCity}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-1">
                    {rec.flight.airline.split('(')[0].trim()}
                  </p>
                  <p className="text-[11px] text-slate-400 mb-3">
                    {rec.flight.aircraft} ({rec.flight.registration || 's/ reg'})
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Distância Aprox.</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      {rec.distanceKm.toLocaleString('pt-BR')} km
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Duração Voo</span>
                    <span className="text-sm font-black text-amber-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {rec.flight.duration}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ROW 3: Fleet Age & Delivery Milestones */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            3. Idade das Aeronaves na Data do Voo (Cálculo por Prefixo)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aircraftAges.map((age, idx) => {
            const theme = [
              { color: 'emerald' as const, badge: 'Mais Nova (Fabr.)', labelColor: 'text-emerald-400' },
              { color: 'blue' as const, badge: 'Mais Nova (Cia)', labelColor: 'text-blue-400' },
              { color: 'amber' as const, badge: 'Mais Antiga (Fabr.)', labelColor: 'text-amber-400' },
            ][idx];

            return (
              <motion.div
                key={age.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
              >
                <div>
                  <PlanespottersPhoto
                    registration={age.registration}
                    aircraftModel={age.flight.aircraft}
                    airline={age.flight.airline}
                    badgeColor={theme.color}
                    badgeLabel={theme.badge}
                    className="h-40 w-full mb-3"
                  />

                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] uppercase font-mono font-bold ${theme.labelColor}`}>
                      {age.title}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {age.registration}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {age.flight.aircraft}
                  </h4>

                  <p className="text-xs text-slate-300 font-medium mb-3">
                    {age.flight.airline.split('(')[0].trim()}
                  </p>

                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 space-y-1 mb-3 text-[11px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Ano de Fabricação:</span>
                      <strong className="text-slate-200 font-mono">{age.manufactureYear}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Entrega na Companhia:</span>
                      <strong className="text-slate-200 font-mono">{age.airlineDeliveryDateStr}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Data do Voo Realizado:</span>
                      <strong className="text-slate-200 font-mono">{age.flight.date}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Metrics */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Idade no Voo</span>
                    <span className={`text-sm font-black font-mono ${theme.labelColor}`}>
                      {age.ageYearsAtFlight} anos
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">Tempo na Cia</span>
                    <span className="text-sm font-black text-slate-200 font-mono">
                      {age.yearsInAirlineAtFlight} anos
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
