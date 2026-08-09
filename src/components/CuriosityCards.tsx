import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Trophy,
  Compass,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Clock,
  Building2,
  Award,
  Armchair,
  PlaneTakeoff,
  Ticket,
  Waypoints,
  ArrowRightLeft,
} from 'lucide-react';
import { Flight } from '../types';
import {
  computeTopRegistrations,
  computeFlightRecords,
  computeAircraftAgeStats,
  computeExtraCuriosities,
  computeTopRoutes,
} from '../utils/aircraftRegistrationData';
import { PlanespottersPhoto } from './PlanespottersPhoto';
import { getAirlineLogo } from '../utils/airlineLogos';

interface CuriosityCardsProps {
  flights: Flight[];
}

export const CuriosityCards: React.FC<CuriosityCardsProps> = ({ flights }) => {
  const topRegistrations = computeTopRegistrations(flights);
  const flightRecords = computeFlightRecords(flights);
  const aircraftAges = computeAircraftAgeStats(flights);
  const extraCuriosities = computeExtraCuriosities(flights);
  const topRoutes = computeTopRoutes(flights);

  return (
    <section className="mb-12 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Bilhetes de Viagem & Curiosidades
            </h2>
            <p className="text-xs text-slate-400">
              Cartões no estilo bilhete de embarque com registros de voo, fotos de aeronaves e logotipos das cias
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/30">
          BOARDING PASS COLLECTION
        </span>
      </div>

      {/* ROW 1: Top 3 Most Flown Aircraft by Registration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            1. Aeronaves Mais Voadas (Classificando pelo Prefixo)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRegistrations.map((item, idx) => {
            const logo = getAirlineLogo(item.airline);

            return (
              <motion.div
                key={item.registration}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
              >
                {/* Decorative Ticket Stub Notches */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />

                <div>
                  {/* Top Ticket Header Banner */}
                  <div className="bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center p-0.5"
                        style={{ backgroundColor: logo.brandColor }}
                      >
                        <img
                          src={logo.logoUrl}
                          alt={item.airline}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter brightness-110"
                        />
                      </div>
                      <span className="text-xs font-bold truncate max-w-[140px]">
                        {logo.shortName}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow">
                      #{idx + 1} • {item.registration}
                    </span>
                  </div>

                  {/* Planespotters Photo */}
                  <div className="p-3 bg-slate-100">
                    <PlanespottersPhoto
                      registration={item.registration}
                      aircraftModel={item.rawAircraft}
                      airline={item.airline}
                      badgeColor="amber"
                      badgeLabel={`#${idx + 1} Prefixo`}
                      className="h-44 w-full shadow-md rounded-xl"
                    />
                  </div>

                  {/* Main Ticket Info Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-widest block">
                        Fabricante: {item.manufacturer}
                      </span>
                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {item.model}
                      </h4>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-mono">Total de Voos</span>
                        <strong className="text-sm font-black text-amber-600 font-mono">
                          {item.count} voos
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-mono">Distância Aprox.</span>
                        <strong className="text-sm font-black text-blue-600 font-mono">
                          {item.totalDistanceKm.toLocaleString('pt-BR')} km
                        </strong>
                      </div>
                    </div>

                    {/* Dashed Separator */}
                    <div className="border-t-2 border-dashed border-slate-200 my-2" />

                    {/* Last Flight Info */}
                    <div className="bg-blue-50/60 p-2.5 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between text-[10px] text-blue-900 font-mono font-bold mb-1">
                        <span>ÚLTIMO VOO COM ELA</span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3 h-3 text-blue-600" /> {item.lastFlight.date}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-xs text-slate-900 font-black">
                        <div>
                          <span>{item.lastFlight.fromIata}</span>
                          <span className="block text-[10px] text-slate-500 font-sans font-normal truncate max-w-[80px]">
                            {item.lastFlight.fromCity}
                          </span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-500 mx-1 shrink-0" />
                        <div className="text-right">
                          <span>{item.lastFlight.toIata}</span>
                          <span className="block text-[10px] text-slate-500 font-sans font-normal truncate max-w-[80px]">
                            {item.lastFlight.toCity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Barcode Footer */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-1 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-1.5 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-1 h-6 bg-slate-900" />
                    <div className="w-2 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    PASSENGER BOARDING CARD
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ROW 2: Top 3 Most Frequent Routes */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Waypoints className="w-4 h-4 text-[#EC6726]" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            2. As 3 Rotas Mais Frequentes (Trajetos Mais Voados)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRoutes.map((route, idx) => {
            const logo = getAirlineLogo(route.primaryAirline);

            return (
              <motion.div
                key={route.routeKey}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
              >
                {/* Decorative Ticket Stub Notches */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />

                <div>
                  {/* Top Ticket Header Banner */}
                  <div className="bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800">
                    <span className="text-xs font-mono font-extrabold bg-[#EC6726] text-white px-2.5 py-0.5 rounded shadow flex items-center gap-1">
                      #{idx + 1} ROTA
                    </span>
                    <span className="text-xs font-mono text-slate-300 font-bold">
                      {route.percentage}% de todos os voos
                    </span>
                  </div>

                  {/* Route Visual Display */}
                  <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white space-y-3 relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#EC6726]/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <span className="text-3xl font-black font-mono tracking-tight text-white block">
                          {route.fromIata}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[90px] block">
                          {route.fromCity.split(',')[0]}
                        </span>
                      </div>

                      <div className="flex-1 px-3 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1 text-[#EC6726] font-mono text-xs font-bold mb-1">
                          <span>{route.count} voos</span>
                        </div>
                        <div className="w-full flex items-center gap-1">
                          <div className="h-0.5 flex-1 bg-slate-700 rounded-full" />
                          <PlaneTakeoff className="w-4 h-4 text-[#EC6726] transform rotate-90 shrink-0" />
                          <div className="h-0.5 flex-1 bg-slate-700 rounded-full" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 mt-1">
                          {route.distanceKm} km
                        </span>
                      </div>

                      <div className="text-center">
                        <span className="text-3xl font-black font-mono tracking-tight text-white block">
                          {route.toIata}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[90px] block">
                          {route.toCity.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route Details */}
                  <div className="p-4 space-y-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-mono text-[11px] font-semibold text-slate-500">
                          Ida & Volta (Sentidos agregados):
                        </span>
                        <strong className="font-mono font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
                          {route.bidirectionalCount} voos
                        </strong>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/60">
                        <span className="font-mono text-[11px] font-semibold text-slate-500">
                          Companhia Principal:
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <div
                            className="w-4 h-4 rounded flex items-center justify-center p-0.5"
                            style={{ backgroundColor: logo.brandColor }}
                          >
                            <img
                              src={logo.logoUrl}
                              alt={route.primaryAirline}
                              referrerPolicy="no-referrer"
                              className="max-h-full max-w-full object-contain filter brightness-110"
                            />
                          </div>
                          <span>{logo.shortName}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-200/60">
                        <span className="font-mono text-[11px] font-semibold text-slate-500">
                          Última Operação:
                        </span>
                        <span className="font-mono text-slate-700 font-semibold">
                          {route.lastFlightDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Barcode */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="w-0.5 h-5 bg-slate-900" />
                    <div className="w-1.5 h-5 bg-slate-900" />
                    <div className="w-0.5 h-5 bg-slate-900" />
                    <div className="w-1 h-5 bg-slate-900" />
                    <div className="w-2 h-5 bg-slate-900" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    MOST FREQUENT ROUTE
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ROW 3: Flight Records */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            3. Recordes de Voo (Mais Longo, Nacional e Mais Curto)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {flightRecords.map((rec, idx) => {
            const logo = getAirlineLogo(rec.flight.airline);
            const badgeTheme = [
              { label: 'Internacional', bg: 'bg-rose-500' },
              { label: 'Nacional', bg: 'bg-emerald-600' },
              { label: 'Mais Curto', bg: 'bg-cyan-600' },
            ][idx];

            return (
              <motion.div
                key={rec.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
              >
                {/* Decorative Ticket Stub Notches */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />

                <div>
                  {/* Top Ticket Header Banner */}
                  <div className="bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center p-0.5"
                        style={{ backgroundColor: logo.brandColor }}
                      >
                        <img
                          src={logo.logoUrl}
                          alt={rec.flight.airline}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter brightness-110"
                        />
                      </div>
                      <span className="text-xs font-bold truncate max-w-[140px]">
                        {logo.shortName}
                      </span>
                    </div>

                    <span className={`text-xs font-mono font-extrabold text-white px-2 py-0.5 rounded shadow ${badgeTheme.bg}`}>
                      {badgeTheme.label}
                    </span>
                  </div>

                  {/* Photo Component */}
                  <div className="p-3 bg-slate-100">
                    <PlanespottersPhoto
                      registration={rec.flight.registration}
                      aircraftModel={rec.flight.aircraft}
                      airline={rec.flight.airline}
                      badgeColor={idx === 0 ? 'rose' : idx === 1 ? 'emerald' : 'cyan'}
                      badgeLabel={rec.title}
                      className="h-44 w-full shadow-md rounded-xl"
                    />
                  </div>

                  {/* Main Ticket Info Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-600">
                        {rec.title}
                      </span>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {rec.flight.date}
                      </span>
                    </div>

                    {/* Route Ticket Highlight */}
                    <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between font-mono shadow">
                      <div>
                        <span className="text-lg font-black text-amber-400">{rec.fromIata}</span>
                        <span className="block text-[10px] text-slate-300 font-sans font-normal truncate max-w-[90px]">
                          {rec.fromCity}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-right">
                        <span className="text-lg font-black text-amber-400">{rec.toIata}</span>
                        <span className="block text-[10px] text-slate-300 font-sans font-normal truncate max-w-[90px]">
                          {rec.toCity}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-700">
                      {rec.flight.aircraft} ({rec.flight.registration || 'sem reg'})
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 block font-mono">Distância Aprox.</span>
                        <strong className="text-sm font-black text-emerald-600 font-mono">
                          {rec.distanceKm.toLocaleString('pt-BR')} km
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block font-mono">Duração Voo</span>
                        <strong className="text-sm font-black text-amber-600 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {rec.flight.duration}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Barcode Footer */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-1.5 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-1 h-6 bg-slate-900" />
                    <div className="w-2 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    FLIGHT RECORD CARD
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ROW 3: Aircraft Age Stats (2 Cards Only as Requested) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            3. Idade das Aeronaves na Data do Voo (Geração de Frota)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aircraftAges.map((age, idx) => {
            const logo = getAirlineLogo(age.flight.airline);
            const badgeTheme = [
              { label: 'Aeronave Mais Nova', bg: 'bg-emerald-600', color: 'emerald' as const },
              { label: 'Aeronave Mais Antiga', bg: 'bg-amber-600', color: 'amber' as const },
            ][idx];

            return (
              <motion.div
                key={age.category}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
              >
                {/* Decorative Ticket Stub Notches */}
                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 z-20" />

                <div>
                  {/* Top Ticket Header Banner */}
                  <div className="bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center p-0.5"
                        style={{ backgroundColor: logo.brandColor }}
                      >
                        <img
                          src={logo.logoUrl}
                          alt={age.flight.airline}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter brightness-110"
                        />
                      </div>
                      <span className="text-xs font-bold truncate max-w-[140px]">
                        {logo.shortName}
                      </span>
                    </div>

                    <span className={`text-xs font-mono font-extrabold text-white px-2 py-0.5 rounded shadow ${badgeTheme.bg}`}>
                      {badgeTheme.label}
                    </span>
                  </div>

                  {/* Photo Component */}
                  <div className="p-3 bg-slate-100">
                    <PlanespottersPhoto
                      registration={age.registration}
                      aircraftModel={age.flight.aircraft}
                      airline={age.flight.airline}
                      badgeColor={badgeTheme.color}
                      badgeLabel={badgeTheme.label}
                      className="h-48 w-full shadow-md rounded-xl"
                    />
                  </div>

                  {/* Main Ticket Info Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-mono text-slate-900">
                        {age.flight.aircraft}
                      </span>
                      <span className="text-xs font-mono font-extrabold bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
                        {age.registration}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Ano de Fabricação:</span>
                        <strong className="text-slate-900 font-mono">{age.manufactureYear}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Entrega na Companhia:</span>
                        <strong className="text-slate-900 font-mono">{age.airlineDeliveryDateStr}</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Data do Voo Realizado:</span>
                        <strong className="text-slate-900 font-mono">{age.flight.date}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                        <span className="text-[10px] text-blue-800 block font-mono font-bold">IDADE NO VOO</span>
                        <strong className="text-base font-black text-blue-600 font-mono">
                          {age.ageYearsAtFlight} anos
                        </strong>
                      </div>

                      <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-600 block font-mono font-bold">TEMPO NA CIA</span>
                        <strong className="text-base font-black text-slate-800 font-mono">
                          {age.yearsInAirlineAtFlight} anos
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Barcode Footer */}
                <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 opacity-70">
                    <div className="w-1 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-2 h-6 bg-slate-900" />
                    <div className="w-0.5 h-6 bg-slate-900" />
                    <div className="w-1 h-6 bg-slate-900" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    AIRCRAFT AGE CERTIFICATE
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ROW 4: Extra Curiosities (Aeroporto, Cia Aérea, Profiling) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
            4. Hábitos & Locais Mais Frequentados
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Aeroporto Mais Frequentado */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-5 text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] uppercase font-mono font-bold text-blue-600 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Aeroporto Mais Frequentado
                </span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {extraCuriosities.topAirport.iata}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {extraCuriosities.topAirport.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {extraCuriosities.topAirport.city}
                </p>
              </div>

              <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">TOTAL DE OPERAÇÕES</span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {extraCuriosities.topAirport.totalOps} movimentos
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-800 font-mono">
                  <span>Decolagens: {extraCuriosities.topAirport.departures}</span>
                  <span>Pousos: {extraCuriosities.topAirport.arrivals}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>HUB OPERACIONAL</span>
              <span>100% VERIFICADO</span>
            </div>
          </motion.div>

          {/* Card 2: Companhia Aérea Mais Voada */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-5 text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
          >
            <div className="space-y-3">
              {(() => {
                const logo = getAirlineLogo(extraCuriosities.topAirline.name);
                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-600 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Companhia Aérea Principal
                      </span>
                      <div
                        className="w-7 h-7 rounded-lg p-1 flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: logo.brandColor }}
                      >
                        <img
                          src={logo.logoUrl}
                          alt={extraCuriosities.topAirline.name}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain filter brightness-110"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                        {extraCuriosities.topAirline.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Companhia aérea com maior frequência no seu log
                      </p>
                    </div>

                    <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono block">VOOS REALIZADOS</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        {extraCuriosities.topAirline.count} voos
                      </div>
                      <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800 font-mono">
                        Destinos Diferentes: {extraCuriosities.topAirline.uniqueDestinations} aeroportos
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>AIRLINE PREFERENCE</span>
              <span>TOP CHOICE</span>
            </div>
          </motion.div>

          {/* Card 3: Perfil do Passageiro (Dia Favorito & Assento) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-5 text-slate-900 border border-slate-200 flex flex-col justify-between relative group hover:shadow-2xl transition-all duration-300"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5" /> Perfil de Voo do Passageiro
                </span>
                <PlaneTakeoff className="w-5 h-5 text-indigo-600" />
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-slate-900 leading-tight">
                  {extraCuriosities.favoriteWeekday.dayName}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Dia da semana com maior incidência de viagens
                </p>
              </div>

              <div className="bg-slate-900 text-white p-3 rounded-xl space-y-2">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">FREQUÊNCIA DE DECOLAGEM</span>
                  <div className="text-xl font-black text-cyan-400 font-mono">
                    {extraCuriosities.favoriteWeekday.count} voos neste dia
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">PREFERÊNCIA DE ASSENTO:</span>
                  <strong className="text-amber-400 font-bold">{extraCuriosities.favoriteWeekday.seatPreference}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-200 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>PASSENGER PROFILE</span>
              <span>FREQUENT FLYER</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
