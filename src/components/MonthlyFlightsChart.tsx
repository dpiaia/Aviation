import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'motion/react';
import { Calendar, BarChart2, Filter, Eye, EyeOff } from 'lucide-react';
import { Flight } from '../types';
import {
  computeMonthlyData,
  YEAR_COLORS,
} from '../utils/flightAnalytics';

interface MonthlyFlightsChartProps {
  flights: Flight[];
  isDarkMode: boolean;
}

export const MonthlyFlightsChart: React.FC<MonthlyFlightsChartProps> = ({
  flights,
  isDarkMode,
}) => {
  const { monthlyData, allYears } = computeMonthlyData(flights);

  // Active years selected for comparison
  const [selectedYears, setSelectedYears] = useState<string[]>(allYears);
  const [showBars, setShowBars] = useState<boolean>(true);

  const toggleYear = (year: string) => {
    if (selectedYears.includes(year)) {
      if (selectedYears.length === 1) return; // keep at least 1
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year].sort((a, b) => Number(a) - Number(b)));
    }
  };

  const selectAllYears = () => setSelectedYears(allYears);
  const selectRecentYears = () =>
    setSelectedYears(allYears.filter((y) => Number(y) >= 2024));

  // Compute filtered monthly data based on selected years
  const { monthlyData: filteredMonthlyData } = computeMonthlyData(flights, selectedYears);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const monthObj = payload[0]?.payload;
      return (
        <div className="p-3.5 bg-slate-950/95 text-white rounded-xl shadow-2xl border border-slate-700/80 text-xs backdrop-blur-md min-w-[190px]">
          <p className="font-bold text-sm text-cyan-400 border-b border-slate-800 pb-1 mb-2">
            {monthObj?.monthName}
          </p>

          <div className="flex items-center justify-between font-semibold mb-2 text-slate-200">
            <span>Total Mês (Barras):</span>
            <span className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 font-mono">
              {monthObj?.total} voos
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">
              Voos por Ano:
            </p>
            {selectedYears.map((year) => {
              const count = monthObj ? monthObj[year] || 0 : 0;
              const color = YEAR_COLORS[year] || '#38bdf8';
              return (
                <div
                  key={year}
                  className={`flex items-center justify-between text-xs ${
                    count > 0 ? 'text-slate-100 font-medium' : 'text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    <span>Ano {year}</span>
                  </div>
                  <span className="font-mono">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-[0_4px_25px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.15),transparent_50%)] pointer-events-none" />

      {/* Chart Header */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">
              Atividade Mensal de Voos
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 pl-10">
            Análise comparativa mês a mês com gráficos de linhas por ano e barras acumuladas
          </p>
        </div>

        {/* Bar Toggle & Quick Preset Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowBars(!showBars)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              showBars
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            {showBars ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Barras Acumuladas</span>
          </button>

          <button
            onClick={selectAllYears}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Todos os Anos
          </button>

          <button
            onClick={selectRecentYears}
            className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            2024-2026
          </button>
        </div>
      </div>

      {/* Year Filter Badges */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 py-3 border-b border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-400" /> Anos:
        </span>
        {allYears.map((year) => {
          const isSelected = selectedYears.includes(year);
          const color = YEAR_COLORS[year] || '#22d3ee';
          return (
            <button
              key={year}
              onClick={() => toggleYear(year)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'text-white shadow-[0_0_12px_rgba(34,211,238,0.2)] border border-white/20'
                  : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
              style={{
                backgroundColor: isSelected ? color : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isSelected ? '#ffffff' : color }}
              />
              <span>{year}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Canvas */}
      <div className="relative z-10 h-[360px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={filteredMonthlyData}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="monthShort"
              stroke="#94a3b8"
              tick={{ fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
              iconType="circle"
            />

            {/* Total Monthly Bar */}
            {showBars && (
              <Bar
                dataKey="total"
                name="Total no Mês"
                fill="#38bdf8"
                fillOpacity={0.15}
                stroke="#38bdf8"
                strokeOpacity={0.4}
                radius={[4, 4, 0, 0]}
                barSize={24}
              />
            )}

            {/* Line for each selected year */}
            {selectedYears.map((year) => {
              const color = YEAR_COLORS[year] || '#22d3ee';
              return (
                <Line
                  key={year}
                  type="monotone"
                  dataKey={year}
                  name={`Ano ${year}`}
                  stroke={color}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: color, strokeWidth: 1, stroke: '#020617' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                  connectNulls
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Info */}
      <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 font-mono">
        <span className="flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
          <span>ANÁLISE COMPARATIVA MENSAL POR ANO</span>
        </span>
        <span className="font-bold text-slate-300">
          TOTAL PERÍODO: {filteredMonthlyData.reduce((a, b) => a + b.total, 0)} VOOS
        </span>
      </div>
    </motion.div>
  );
};
