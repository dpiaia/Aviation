import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileSpreadsheet, Upload, Check, Download, Sparkles, FileCode, Plus } from 'lucide-react';
import { Flight } from '../types';
import Papa from 'papaparse';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportFlights: (importedFlights: Flight[]) => void;
  isDarkMode?: boolean;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onImportFlights,
  isDarkMode = true,
}) => {
  const [csvText, setCsvText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'myflightradar' | 'custom' | 'text'>('myflightradar');

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const templateContent = `Date,Flight number,From,To,Dep time,Arr time,Duration,Airline,Aircraft,Registration,Seat number,Note
2026-05-15,LA3021,GRU,SDU,08:30:00,09:30:00,01:00:00,LATAM Brasil,Airbus A320neo,PR-XBB,12A,"Voo calmo pela manhã"
2026-06-20,G31420,CGH,BSB,14:15:00,16:00:00,01:45:00,Gol Linhas Aéreas,Boeing 737 MAX 8,PR-XMR,04F,"Excelente atendimento"
2026-07-10,AD4050,VCP,CNF,10:00:00,11:15:00,01:15:00,Azul Linhas Aéreas,Embraer E195-E2,PS-AE1,02A,"Assento espaçoso"`;

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'flydiary_modelo_voos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processParsedData = (data: any[]) => {
    if (!data || data.length === 0) {
      setStatusMsg('Nenhum dado encontrado no arquivo.');
      return;
    }

    const parsedFlights: Flight[] = [];

    data.forEach((row: any, idx: number) => {
      // Standardize key names to lowercase
      const keys = Object.keys(row);
      const getField = (possibleNames: string[]) => {
        for (const name of possibleNames) {
          const match = keys.find((k) => k.toLowerCase().trim() === name.toLowerCase());
          if (match && row[match]) return String(row[match]).trim();
        }
        return '';
      };

      const date = getField(['date', 'data', 'data voo', 'flight_date']);
      if (!date || date.length < 4) return;

      const flightNumber = getField(['flight number', 'flight', 'voo', 'numero_voo', 'flight_number']) || 'N/A';
      const from = getField(['from', 'de', 'origem', 'dep']) || 'GRU';
      const to = getField(['to', 'para', 'destino', 'arr']) || 'SDU';
      const depTime = getField(['dep time', 'partida', 'saida', 'dep_time']) || '08:00:00';
      const arrTime = getField(['arr time', 'chegada', 'pouso', 'arr_time']) || '09:15:00';
      const duration = getField(['duration', 'duracao', 'duracao_voo']) || '01:15:00';
      const airline = getField(['airline', 'cia', 'companhia', 'airline_name']) || 'Companhia Aérea';
      const aircraft = getField(['aircraft', 'aeronave', 'modelo', 'aircraft_model']) || 'Airbus A320';
      const registration = getField(['registration', 'prefixo', 'matricula', 'reg']) || '';
      const seatNumber = getField(['seat number', 'seat', 'assento', 'poltrona']) || '12A';
      const note = getField(['note', 'observacao', 'notas', 'obs']) || '';

      parsedFlights.push({
        id: `f-import-${Date.now()}-${idx}`,
        date,
        flightNumber,
        from,
        to,
        depTime,
        arrTime,
        duration,
        airline,
        aircraft,
        registration,
        seatNumber,
        seatType: '0',
        flightClass: '0',
        flightReason: '0',
        note,
      });
    });

    if (parsedFlights.length === 0) {
      setStatusMsg('Nenhum voo válido pôde ser extraído. Verifique os cabeçalhos das colunas.');
      return;
    }

    onImportFlights(parsedFlights);
    setStatusMsg(`Sucesso! ${parsedFlights.length} voos importados para o FlyDiary.`);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  const handleParseCsv = () => {
    if (!csvText.trim()) {
      setStatusMsg('Por favor, selecione um arquivo ou cole o conteúdo do CSV.');
      return;
    }

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedData(results.data);
      },
      error: (err) => {
        console.error(err);
        setStatusMsg('Erro ao ler CSV. Verifique a formatação do arquivo.');
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processParsedData(results.data);
      },
      error: (err) => {
        console.error(err);
        setStatusMsg('Erro ao ler o arquivo enviado.');
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-xl p-6 border rounded-2xl shadow-2xl relative transition-all ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Importar Voos para o FlyDiary
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Suporte para arquivos CSV do my.flightradar24 e planilhas de Excel.
              </p>
            </div>
          </div>

          {/* Source Tabs */}
          <div className={`flex border-b mb-5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              onClick={() => setActiveTab('myflightradar')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'myflightradar'
                  ? 'border-[#EC6726] text-[#EC6726]'
                  : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
              }`}
            >
              my.Flightradar24 CSV
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'custom'
                  ? 'border-[#EC6726] text-[#EC6726]'
                  : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
              }`}
            >
              Excel / CSV Personalizado
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'border-[#EC6726] text-[#EC6726]'
                  : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
              }`}
            >
              Colar Texto CSV
            </button>
          </div>

          {activeTab === 'myflightradar' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <p className="font-semibold text-[#EC6726] mb-1">Como exportar do my.flightradar24:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px]">
                  <li>Acesse sua conta no <strong>my.flightradar24.com</strong></li>
                  <li>Vá no menu <strong>Settings</strong> &gt; <strong>Export</strong></li>
                  <li>Faça o download do arquivo <code>.csv</code> contendo seus voos e envie-o abaixo.</li>
                </ol>
              </div>

              <label className={`block w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-slate-800 hover:border-[#EC6726]/60 bg-slate-950/50'
                  : 'border-slate-200 hover:border-[#EC6726]/60 bg-slate-50'
              }`}>
                <Upload className="w-6 h-6 text-[#EC6726] mx-auto mb-2" />
                <span className={`text-xs font-semibold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Selecione o arquivo CSV do my.Flightradar24
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Formatos aceitos: .csv</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Modelo de Planilha Padrão
                </span>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-3 py-1.5 rounded-lg bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-[#EC6726]/20 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Baixar Modelo .CSV
                </button>
              </div>

              <label className={`block w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDarkMode
                  ? 'border-slate-800 hover:border-[#EC6726]/60 bg-slate-950/50'
                  : 'border-slate-200 hover:border-[#EC6726]/60 bg-slate-50'
              }`}>
                <Upload className="w-6 h-6 text-[#EC6726] mx-auto mb-2" />
                <span className={`text-xs font-semibold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Selecione seu arquivo .csv de voos
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-3">
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder='Date,"Flight number",From,To,"Dep time","Arr time",Duration,Airline,Aircraft,Registration,Seat number,Note...'
                className={`w-full p-3 text-xs font-mono border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={handleParseCsv}
                className="w-full py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" /> Processar Texto CSV
              </button>
            </div>
          )}

          {statusMsg && (
            <p className="mt-4 text-xs font-mono font-medium text-[#EC6726] flex items-center gap-1.5 p-2.5 rounded-xl bg-[#EC6726]/10 border border-[#EC6726]/30">
              <Sparkles className="w-4 h-4 text-[#EC6726]" /> {statusMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
