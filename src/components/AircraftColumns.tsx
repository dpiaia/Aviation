import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plane,
  Trophy,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Factory,
  Layers,
} from 'lucide-react';
import { Flight } from '../types';
import {
  computeSpecificModelStats,
  computeGroupedModelStats,
  computeManufacturerStats,
} from '../utils/flightAnalytics';
import { PlanespottersPhoto } from './PlanespottersPhoto';

interface AircraftColumnsProps {
  flights: Flight[];
  isDarkMode?: boolean;
}

export const AircraftColumns: React.FC<AircraftColumnsProps> = ({ flights, isDarkMode = true }) => {
  const specificStats = computeSpecificModelStats(flights);
  const groupedStats = computeGroupedModelStats(flights);
  const manufacturerStats = computeManufacturerStats(flights);

  // Toggle state for seeing beyond top 3
  const [showAllSpecific, setShowAllSpecific] = useState(false);
  const [showAllGrouped, setShowAllGrouped] = useState(false);
  const [showAllManufacturers, setShowAllManufacturers] = useState(false);

  const top1Specific = specificStats[0];
  const otherSpecifics = showAllSpecific
    ? specificStats.slice(1)
    : specificStats.slice(1, 3);

  const top1Grouped = groupedStats[0];
  const otherGrouped = showAllGrouped
    ? groupedStats.slice(1)
    : groupedStats.slice(1, 3);

  const top1Manufacturer = manufacturerStats[0];
  const otherManufacturers = showAllManufacturers
    ? manufacturerStats.slice(1)
    : manufacturerStats.slice(1, 3);

  return (
    <section className="mb-8 space-y-5">
      {/* Section Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800/80 text-white'
          : 'bg-white/80 border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EC6726] text-white flex items-center justify-center shadow-lg shadow-[#EC6726]/20 shrink-0">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Análise de Frota & Fabricantes
            </h2>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Métricas de voos categorizadas por modelo específico, famílias de aeronaves e fabricantes
            </p>
          </div>
        </div>

        <span className={`self-start sm:self-auto text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-xs ${
          isDarkMode
            ? 'bg-slate-800 text-blue-400 border-slate-700'
            : 'bg-blue-50 text-blue-600 border-blue-200'
        }`}>
          HISTÓRICO VERIFICADO
        </span>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= COLUNA 1: MODELO ESPECÍFICO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Plane className="w-3.5 h-3.5 text-blue-500" /> Modelos Específicos
            </h3>
            <span className="text-[10px] font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {specificStats.length} Modelos
            </span>
          </div>

          <div className={`flex-1 border rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-xl group transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-900/70 border-blue-500/30 hover:border-blue-500/50 shadow-[0_10px_30px_rgba(37,99,235,0.12)]'
              : 'bg-white/90 border-slate-200 hover:border-blue-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
          }`}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Featured Card #1 with Model Photo */}
            {top1Specific && (
              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> #1 Mais Voado
                  </span>
                  <span className={`text-3xl font-black italic font-mono ${isDarkMode ? 'text-slate-700/60' : 'text-slate-300'}`}>01</span>
                </div>

                {/* Model Photo Banner */}
                <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                  <PlanespottersPhoto
                    registration={top1Specific.registrations?.[0] || ''}
                    aircraftModel={top1Specific.modelName}
                    airline={top1Specific.manufacturer}
                    badgeColor="blue"
                    badgeLabel="Aeronave #1"
                    photoIndex={0}
                    className="h-38 w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none z-20">
                    <span className="text-[10px] text-blue-400 uppercase tracking-widest font-mono font-extrabold">
                      {top1Specific.manufacturer}
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {top1Specific.modelName}
                    </h4>
                  </div>
                </div>

                <div className="mb-3 relative z-10">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-blue-500 font-mono">
                        {top1Specific.count}
                      </span>
                      <span className={`text-xs font-medium font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        voos
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      isDarkMode
                        ? 'text-slate-300 bg-slate-800 border-slate-700'
                        : 'text-slate-700 bg-slate-100 border-slate-200'
                    }`}>
                      {top1Specific.percentage}% do total
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={`w-full rounded-full h-2 mb-4 overflow-hidden p-0.5 border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${top1Specific.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Runners Up List */}
            <div className={`space-y-2.5 pt-4 border-t relative z-10 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              {otherSpecifics.map((item, idx) => (
                <div
                  key={item.modelName}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                    isDarkMode
                      ? 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-200'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className={`w-5 font-mono font-bold text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      #{idx + 2}
                    </span>
                    <span className="font-semibold">
                      {item.modelName}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {item.count} voos
                  </span>
                </div>
              ))}
            </div>

            {/* Expand Toggle */}
            {specificStats.length > 3 && (
              <button
                onClick={() => setShowAllSpecific(!showAllSpecific)}
                className={`mt-4 pt-2 w-full text-xs font-semibold text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1 border-t transition-colors cursor-pointer ${
                  isDarkMode ? 'border-slate-800/60' : 'border-slate-200'
                }`}
              >
                <span>
                  {showAllSpecific ? 'Recolher' : `Ver todos (${specificStats.length})`}
                </span>
                {showAllSpecific ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* ================= COLUNA 2: MODELOS AGRUPADOS (FAMÍLIAS) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Layers className="w-3.5 h-3.5 text-amber-500" /> Famílias de Aeronaves
            </h3>
            <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {groupedStats.length} Famílias
            </span>
          </div>

          <div className={`flex-1 border rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-xl group transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-900/70 border-amber-500/30 hover:border-amber-500/50 shadow-[0_10px_30px_rgba(245,158,11,0.1)]'
              : 'bg-white/90 border-slate-200 hover:border-amber-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
          }`}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Featured Card #1 with Family Photo */}
            {top1Grouped && (
              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Grupo Líder
                  </span>
                  <span className={`text-3xl font-black italic font-mono ${isDarkMode ? 'text-slate-700/60' : 'text-slate-300'}`}>02</span>
                </div>

                {/* Family Photo Banner */}
                <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                  <PlanespottersPhoto
                    registration={top1Grouped.registrations?.[1] || top1Grouped.registrations?.[0] || ''}
                    aircraftModel={top1Grouped.familyGroup}
                    airline={top1Grouped.manufacturer}
                    badgeColor="amber"
                    badgeLabel="Família Líder"
                    photoIndex={1}
                    className="h-38 w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none z-20">
                    <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-extrabold">
                      {top1Grouped.manufacturer}
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {top1Grouped.familyGroup}
                    </h4>
                  </div>
                </div>

                <div className="mb-3 relative z-10">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-amber-500 font-mono">
                        {top1Grouped.count}
                      </span>
                      <span className={`text-xs font-medium font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        voos
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      isDarkMode
                        ? 'text-slate-300 bg-slate-800 border-slate-700'
                        : 'text-slate-700 bg-slate-100 border-slate-200'
                    }`}>
                      {top1Grouped.percentage}% do total
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={`w-full rounded-full h-2 mb-4 overflow-hidden p-0.5 border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full"
                    style={{ width: `${top1Grouped.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Runners Up List */}
            <div className={`space-y-2.5 pt-4 border-t relative z-10 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              {otherGrouped.map((item, idx) => (
                <div
                  key={item.familyGroup}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                    isDarkMode
                      ? 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-200'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className={`w-5 font-mono font-bold text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      #{idx + 2}
                    </span>
                    <span className="font-semibold">
                      {item.familyGroup}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {item.count} voos
                  </span>
                </div>
              ))}
            </div>

            {/* Expand Toggle */}
            {groupedStats.length > 3 && (
              <button
                onClick={() => setShowAllGrouped(!showAllGrouped)}
                className={`mt-4 pt-2 w-full text-xs font-semibold text-amber-500 hover:text-amber-600 flex items-center justify-center gap-1 border-t transition-colors cursor-pointer ${
                  isDarkMode ? 'border-slate-800/60' : 'border-slate-200'
                }`}
              >
                <span>
                  {showAllGrouped ? 'Recolher' : `Ver todos (${groupedStats.length})`}
                </span>
                {showAllGrouped ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* ================= COLUNA 3: FABRICANTES ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className={`text-xs font-bold uppercase tracking-widest font-mono flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Factory className="w-3.5 h-3.5 text-purple-500" /> Fabricantes
            </h3>
            <span className="text-[10px] font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              {manufacturerStats.length} Marcas
            </span>
          </div>

          <div className={`flex-1 border rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden backdrop-blur-xl group transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-900/70 border-purple-500/30 hover:border-purple-500/50 shadow-[0_10px_30px_rgba(168,85,247,0.12)]'
              : 'bg-white/90 border-slate-200 hover:border-purple-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
          }`}>
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Featured Card #1 with Manufacturer Photo */}
            {top1Manufacturer && (
              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1.5 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    <Factory className="w-3.5 h-3.5 text-purple-500" /> Fabricante Líder
                  </span>
                  <span className={`text-3xl font-black italic font-mono ${isDarkMode ? 'text-slate-700/60' : 'text-slate-300'}`}>03</span>
                </div>

                {/* Manufacturer Photo Banner */}
                <div className="relative mb-4 rounded-xl overflow-hidden border border-slate-800 shadow-md">
                  <PlanespottersPhoto
                    registration={top1Manufacturer.registrations?.[0] || ''}
                    aircraftModel={top1Manufacturer.name}
                    airline={top1Manufacturer.name}
                    badgeColor="purple"
                    badgeLabel="Maior Frota"
                    photoIndex={2}
                    className="h-38 w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none z-20">
                    <span className="text-[10px] text-purple-400 uppercase tracking-widest font-mono font-extrabold">
                      INDÚSTRIA AERONÁUTICA
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {top1Manufacturer.name}
                    </h4>
                  </div>
                </div>

                <div className="mb-3 relative z-10">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-purple-500 font-mono">
                        {top1Manufacturer.count}
                      </span>
                      <span className={`text-xs font-medium font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        voos
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                      isDarkMode
                        ? 'text-slate-300 bg-slate-800 border-slate-700'
                        : 'text-slate-700 bg-slate-100 border-slate-200'
                    }`}>
                      {top1Manufacturer.percentage}% do total
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={`w-full rounded-full h-2 mb-4 overflow-hidden p-0.5 border ${
                  isDarkMode ? 'bg-slate-800 border-slate-700/50' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                    style={{ width: `${top1Manufacturer.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Runners Up List */}
            <div className={`space-y-2.5 pt-4 border-t relative z-10 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              {otherManufacturers.map((item, idx) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                    isDarkMode
                      ? 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-200'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className={`w-5 font-mono font-bold text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      #{idx + 2}
                    </span>
                    <span className="font-semibold">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {item.count} voos
                  </span>
                </div>
              ))}
            </div>

            {/* Expand Toggle */}
            {manufacturerStats.length > 3 && (
              <button
                onClick={() => setShowAllManufacturers(!showAllManufacturers)}
                className={`mt-4 pt-2 w-full text-xs font-semibold text-purple-500 hover:text-purple-600 flex items-center justify-center gap-1 border-t transition-colors cursor-pointer ${
                  isDarkMode ? 'border-slate-800/60' : 'border-slate-200'
                }`}
              >
                <span>
                  {showAllManufacturers
                    ? 'Recolher'
                    : `Ver todos (${manufacturerStats.length})`}
                </span>
                {showAllManufacturers ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
