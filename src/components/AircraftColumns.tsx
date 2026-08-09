import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane,
  Layers,
  Factory,
  Trophy,
  ChevronRight,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Camera,
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
}

function getAircraftPhoto(name: string, category: 'model' | 'family' | 'manufacturer'): string {
  const nameLower = (name || '').toLowerCase();

  if (category === 'model') {
    if (nameLower.includes('e195-e2') || nameLower.includes('e295')) {
      return 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('erj-195') || nameLower.includes('e195')) {
      return 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('atr')) {
      return 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('a320')) {
      return 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80';
  }

  if (category === 'family') {
    if (nameLower.includes('embraer') || nameLower.includes('e-jets')) {
      return 'https://images.unsplash.com/photo-1519074069444-1ba4eff56022?auto=format&fit=crop&w=800&q=80';
    }
    if (nameLower.includes('airbus') || nameLower.includes('a320')) {
      return 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=800&q=80';
    }
    return 'https://images.unsplash.com/photo-1583551538520-2175949a20a4?auto=format&fit=crop&w=800&q=80';
  }

  // Manufacturer
  if (nameLower.includes('embraer')) {
    return 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80';
  }
  if (nameLower.includes('airbus')) {
    return 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80';
  }
  if (nameLower.includes('boeing')) {
    return 'https://images.unsplash.com/photo-1544016768-982d1554c0b7?auto=format&fit=crop&w=800&q=80';
  }

  return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80';
}

export const AircraftColumns: React.FC<AircraftColumnsProps> = ({ flights }) => {
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
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Análise de Frota & Fabricantes
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-10">
            Métricas de frota por modelos específicos, famílias de aeronaves e indústrias
          </p>
        </div>

        <span className="self-start sm:self-auto text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-900/80 text-blue-400 border border-slate-800">
          RANKING DADOS REAIS
        </span>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= COLUNA 1: MODELO ESPECÍFICO ================= */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
            Modelos Específicos
          </h3>

          <div className="flex-1 bg-slate-900/40 border border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(37,99,235,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Featured Card #1 with Model Photo */}
            {top1Specific && (
              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" /> #1 Top Flyer
                  </span>
                  <span className="text-3xl font-black italic text-slate-700/50">01</span>
                </div>

                {/* Model Photo Banner */}
                <div className="relative mb-4">
                  <PlanespottersPhoto
                    registration={top1Specific.registrations?.[0] || ''}
                    aircraftModel={top1Specific.modelName}
                    airline={top1Specific.manufacturer}
                    badgeColor="blue"
                    badgeLabel="Foto Modelo"
                    className="h-36 w-full"
                  />
                  <div className="absolute bottom-2 left-3 right-3 pointer-events-none z-10">
                    <span className="text-[10px] text-blue-300 uppercase tracking-widest font-mono font-bold">
                      {top1Specific.manufacturer}
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {top1Specific.modelName}
                    </h4>
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-blue-400 font-mono">
                      {top1Specific.count}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      voos ({top1Specific.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${top1Specific.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Runners Up List */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80 relative z-10">
              {otherSpecifics.map((item, idx) => (
                <div
                  key={item.modelName}
                  className="flex items-center justify-between opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-slate-500 font-mono text-[10px]">
                      {idx + 2}.
                    </span>
                    <span className="font-semibold text-slate-200">
                      {item.modelName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.count} voos
                  </span>
                </div>
              ))}
            </div>

            {/* Expand Toggle */}
            {specificStats.length > 3 && (
              <button
                onClick={() => setShowAllSpecific(!showAllSpecific)}
                className="mt-4 pt-2 w-full text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 border-t border-slate-800/60 transition-colors cursor-pointer"
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
        </div>

        {/* ================= COLUNA 2: MODELOS AGRUPADOS (FAMÍLIAS) ================= */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
            Famílias de Aeronaves
          </h3>

          <div className="flex-1 bg-slate-900/40 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(245,158,11,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Featured Card #1 with Family Photo */}
            {top1Grouped && (
              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Grupo Mais Ativo
                  </span>
                  <span className="text-3xl font-black italic text-slate-700/50">02</span>
                </div>

                {/* Family Photo Banner */}
                <div className="relative mb-4">
                  <PlanespottersPhoto
                    registration={top1Grouped.registrations?.[0] || ''}
                    aircraftModel={top1Grouped.familyGroup}
                    airline={top1Grouped.manufacturer}
                    badgeColor="amber"
                    badgeLabel="Foto Família"
                    className="h-36 w-full"
                  />
                  <div className="absolute bottom-2 left-3 right-3 pointer-events-none z-10">
                    <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono font-bold">
                      {top1Grouped.manufacturer}
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {top1Grouped.familyGroup}
                    </h4>
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <p className="text-xs text-slate-400 truncate">{top1Grouped.description}</p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {top1Grouped.count}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      voos ({top1Grouped.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full"
                    style={{ width: `${top1Grouped.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Runners Up List */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80 relative z-10">
              {otherGrouped.map((item, idx) => (
                <div
                  key={item.familyGroup}
                  className="flex items-center justify-between opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2 text-xs truncate mr-2">
                    <span className="w-4 text-slate-500 font-mono text-[10px]">
                      {idx + 2}.
                    </span>
                    <span className="font-semibold text-slate-200 truncate">
                      {item.familyGroup}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {item.count} voos
                  </span>
                </div>
              ))}
            </div>

            {/* Expand Toggle */}
            {groupedStats.length > 3 && (
              <button
                onClick={() => setShowAllGrouped(!showAllGrouped)}
                className="mt-4 pt-2 w-full text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 border-t border-slate-800/60 transition-colors cursor-pointer"
              >
                <span>
                  {showAllGrouped ? 'Recolher' : `Ver todas (${groupedStats.length})`}
                </span>
                {showAllGrouped ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* ================= COLUNA 3: FABRICANTES MAIS USADOS ================= */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-1">
            Fabricantes
          </h3>

          <div className="flex-1 bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(6,182,212,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Featured Card #1 with Manufacturer Photo */}
            {top1Manufacturer && (
              <div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5" /> Principal Fabricante
                  </span>
                  <span className="text-3xl font-black italic text-slate-700/50">03</span>
                </div>

                {/* Manufacturer Photo Banner */}
                <div className="relative mb-4">
                  <PlanespottersPhoto
                    registration={top1Manufacturer.registrations?.[0] || ''}
                    aircraftModel={top1Manufacturer.topModel || top1Manufacturer.name}
                    airline={top1Manufacturer.name}
                    badgeColor="cyan"
                    badgeLabel="Foto Indústria"
                    className="h-36 w-full"
                  />
                  <div className="absolute bottom-2 left-3 right-3 pointer-events-none z-10">
                    <span className="text-[10px] text-cyan-300 uppercase tracking-widest font-mono font-bold">
                      Indústria Aeronáutica
                    </span>
                    <h4 className="text-lg font-bold text-white leading-tight drop-shadow-md">
                      {top1Manufacturer.name}
                    </h4>
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <p className="text-xs text-slate-400">
                    Mais voado: <strong className="text-slate-200">{top1Manufacturer.topModel}</strong>
                  </p>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-cyan-400 font-mono">
                      {top1Manufacturer.count}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      voos ({top1Manufacturer.percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full"
                    style={{ width: `${top1Manufacturer.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Runners Up List */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80 relative z-10">
              {otherManufacturers.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between opacity-90 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-4 text-slate-500 font-mono text-[10px]">
                      {idx + 2}.
                    </span>
                    <span className="font-semibold text-slate-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {item.percentage}% share
                  </span>
                </div>
              ))}
            </div>

            {/* Expand Toggle */}
            {manufacturerStats.length > 3 && (
              <button
                onClick={() => setShowAllManufacturers(!showAllManufacturers)}
                className="mt-4 pt-2 w-full text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 border-t border-slate-800/60 transition-colors cursor-pointer"
              >
                <span>
                  {showAllManufacturers ? 'Recolher' : `Ver todos (${manufacturerStats.length})`}
                </span>
                {showAllManufacturers ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

