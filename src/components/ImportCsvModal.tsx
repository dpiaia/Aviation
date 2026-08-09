import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileSpreadsheet, Upload, Check } from 'lucide-react';
import { Flight } from '../types';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFlights: (importedFlights: Flight[]) => void;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onImportFlights,
}) => {
  const [csvText, setCsvText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleParseCsv = () => {
    if (!csvText.trim()) {
      setStatusMsg('Por favor, cole o conteúdo do CSV.');
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        setStatusMsg('Formato inválido. O CSV deve possuir cabeçalho e linhas.');
        return;
      }

      // Basic naive CSV line parser respecting quotes
      const parseCsvLine = (line: string) => {
        const result: string[] = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const parsedFlights: Flight[] = [];
      const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/"/g, ''));

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = parseCsvLine(lines[i]);

        // Extract values based on standard indexes or column names
        const dateIdx = header.findIndex((h) => h.includes('date'));
        const fnIdx = header.findIndex((h) => h.includes('flight number') || h.includes('flight'));
        const fromIdx = header.findIndex((h) => h.includes('from'));
        const toIdx = header.findIndex((h) => h.includes('to'));
        const depTimeIdx = header.findIndex((h) => h.includes('dep time'));
        const arrTimeIdx = header.findIndex((h) => h.includes('arr time'));
        const durIdx = header.findIndex((h) => h.includes('duration'));
        const airlineIdx = header.findIndex((h) => h.includes('airline'));
        const aircraftIdx = header.findIndex((h) => h.includes('aircraft'));
        const regIdx = header.findIndex((h) => h.includes('registration'));
        const seatIdx = header.findIndex((h) => h.includes('seat number') || h.includes('seat'));
        const noteIdx = header.findIndex((h) => h.includes('note'));

        const getVal = (idx: number, defaultVal = '') =>
          idx >= 0 && row[idx] !== undefined ? row[idx].replace(/"/g, '') : defaultVal;

        const date = getVal(dateIdx, row[0] || '');
        if (!date || date.length < 4) continue;

        parsedFlights.push({
          id: `f-import-${Date.now()}-${i}`,
          date,
          flightNumber: getVal(fnIdx, row[1] || ''),
          from: getVal(fromIdx, row[2] || ''),
          to: getVal(toIdx, row[3] || ''),
          depTime: getVal(depTimeIdx, row[4] || '00:00:00'),
          arrTime: getVal(arrTimeIdx, row[5] || '00:00:00'),
          duration: getVal(durIdx, row[6] || '01:00:00'),
          airline: getVal(airlineIdx, row[7] || ''),
          aircraft: getVal(aircraftIdx, row[8] || 'Aeronave'),
          registration: getVal(regIdx, row[9] || ''),
          seatNumber: getVal(seatIdx, row[10] || ''),
          seatType: '0',
          flightClass: '0',
          flightReason: '0',
          note: getVal(noteIdx, row[14] || ''),
        });
      }

      if (parsedFlights.length === 0) {
        setStatusMsg('Nenhum voo válido pôde ser extraído.');
        return;
      }

      onImportFlights(parsedFlights);
      setStatusMsg(`Sucesso! ${parsedFlights.length} voos importados.`);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
      setStatusMsg('Erro ao processar CSV. Verifique o formato.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Importar Voos via CSV
            </h3>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Cole abaixo o conteúdo em formato CSV ou selecione um arquivo <code>.csv</code>.
          </p>

          <div className="mb-4">
            <label className="block w-full border-2 border-dashed border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500/50 bg-slate-950/50 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-semibold text-slate-300 block">
                Clique para selecionar arquivo CSV
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Ou cole o texto CSV aqui:
            </label>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder='Date,"Flight number",From,To,"Dep time","Arr time",Duration,Airline,Aircraft,Registration...'
              className="w-full p-2.5 text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {statusMsg && (
            <p className="text-xs font-mono font-medium text-blue-400 mb-3 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-400" /> {statusMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleParseCsv}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" /> Importar Dados
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
