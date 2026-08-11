import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileSpreadsheet,
  Upload,
  Check,
  Download,
  Sparkles,
  Link,
  RefreshCw,
  ArrowRight,
  Database,
  Table,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Flight, ColumnMapping } from '../types';
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
  const [activeTab, setActiveTab] = useState<'myflightradar' | 'custom' | 'googlesheets' | 'text'>('myflightradar');
  const [csvText, setCsvText] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');

  // Column Mapping ("De / Para") State
  const [parsedRawRows, setParsedRawRows] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [showMappingStep, setShowMappingStep] = useState(false);
  const [columnMap, setColumnMap] = useState<ColumnMapping>({
    date: '',
    flightNumber: '',
    from: '',
    to: '',
    depTime: '',
    arrTime: '',
    duration: '',
    airline: '',
    aircraft: '',
    registration: '',
    seatNumber: '',
    note: '',
  });

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

  // Process data directly or auto-detect
  const processParsedDataWithMap = (data: any[], map: ColumnMapping) => {
    if (!data || data.length === 0) {
      setStatusMsg('Nenhum dado encontrado para importar.');
      return;
    }

    const parsedFlights: Flight[] = [];

    data.forEach((row: any, idx: number) => {
      const getVal = (fieldKey: keyof ColumnMapping, fallbackKeys: string[] = []) => {
        const mappedCol = map[fieldKey];
        if (mappedCol && row[mappedCol] !== undefined && row[mappedCol] !== null) {
          return String(row[mappedCol]).trim();
        }
        // Fallback auto-detection if unmapped
        const keys = Object.keys(row);
        for (const fk of fallbackKeys) {
          const match = keys.find((k) => k.toLowerCase().trim() === fk.toLowerCase());
          if (match && row[match]) return String(row[match]).trim();
        }
        return '';
      };

      const date = getVal('date', ['date', 'data', 'data_voo', 'flight_date']);
      if (!date || date.length < 4) return;

      const flightNumber = getVal('flightNumber', ['flight number', 'flight', 'voo', 'numero_voo']) || 'N/A';
      const from = getVal('from', ['from', 'de', 'origem', 'dep']) || 'GRU';
      const to = getVal('to', ['to', 'para', 'destino', 'arr']) || 'SDU';
      const depTime = getVal('depTime', ['dep time', 'partida', 'saida']) || '08:00:00';
      const arrTime = getVal('arrTime', ['arr time', 'chegada', 'pouso']) || '09:15:00';
      const duration = getVal('duration', ['duration', 'duracao']) || '01:15:00';
      const airline = getVal('airline', ['airline', 'cia', 'companhia']) || 'Companhia Aérea';
      const aircraft = getVal('aircraft', ['aircraft', 'aeronave', 'modelo']) || 'Airbus A320';
      const registration = getVal('registration', ['registration', 'prefixo', 'matricula']) || '';
      const seatNumber = getVal('seatNumber', ['seat number', 'seat', 'assento']) || '12A';
      const note = getVal('note', ['note', 'observacao', 'notas']) || '';

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
      setStatusMsg('Nenhum voo válido retornado. Verifique a associação das colunas.');
      return;
    }

    onImportFlights(parsedFlights);
    setStatusMsg(`Sucesso! ${parsedFlights.length} voos concatenados e importados!`);
    setTimeout(() => {
      setShowMappingStep(false);
      onClose();
    }, 900);
  };

  const handleFileUploadAndOpenMapping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (!results.data || results.data.length === 0) {
          setStatusMsg('O arquivo está vazio.');
          return;
        }

        const headers = results.meta.fields || Object.keys(results.data[0] || {});
        setCsvHeaders(headers);
        setParsedRawRows(results.data);

        // Auto-detect initial column mappings ("De / Para")
        const autoMap: ColumnMapping = {
          date: headers.find((h) => /date|data/i.test(h)) || '',
          flightNumber: headers.find((h) => /flight|voo|numero/i.test(h)) || '',
          from: headers.find((h) => /from|de|origem|dep/i.test(h)) || '',
          to: headers.find((h) => /to|para|destino|arr/i.test(h)) || '',
          depTime: headers.find((h) => /dep_time|partida|saida/i.test(h)) || '',
          arrTime: headers.find((h) => /arr_time|chegada|pouso/i.test(h)) || '',
          duration: headers.find((h) => /durat|duracao/i.test(h)) || '',
          airline: headers.find((h) => /airl|cia|companhia/i.test(h)) || '',
          aircraft: headers.find((h) => /airc|aeronave|modelo/i.test(h)) || '',
          registration: headers.find((h) => /reg|prefixo|matricula/i.test(h)) || '',
          seatNumber: headers.find((h) => /seat|assento|poltrona/i.test(h)) || '',
          note: headers.find((h) => /note|obs|notas/i.test(h)) || '',
        };

        setColumnMap(autoMap);
        setShowMappingStep(true);
        setStatusMsg('');
      },
      error: (err) => {
        console.error(err);
        setStatusMsg('Erro ao ler arquivo CSV/Excel.');
      },
    });
  };

  const handleGoogleSheetsSync = async () => {
    if (!googleSheetUrl.trim()) {
      setStatusMsg('Informe a URL pública ou ID da sua planilha do Google Sheets.');
      return;
    }

    setIsSyncingSheets(true);
    setStatusMsg('Conectando ao Google Sheets e buscando dados mais recentes...');

    try {
      let csvFetchUrl = googleSheetUrl.trim();
      // If full Google sheet URL provided, convert to export CSV url
      if (csvFetchUrl.includes('docs.google.com/spreadsheets')) {
        const sheetIdMatch = csvFetchUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (sheetIdMatch && sheetIdMatch[1]) {
          csvFetchUrl = `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/export?format=csv`;
        }
      }

      const res = await fetch(csvFetchUrl);
      const text = await res.text();

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setIsSyncingSheets(false);
          const headers = results.meta.fields || Object.keys(results.data[0] || {});
          setCsvHeaders(headers);
          setParsedRawRows(results.data);

          const autoMap: ColumnMapping = {
            date: headers.find((h) => /date|data/i.test(h)) || '',
            flightNumber: headers.find((h) => /flight|voo|numero/i.test(h)) || '',
            from: headers.find((h) => /from|de|origem|dep/i.test(h)) || '',
            to: headers.find((h) => /to|para|destino|arr/i.test(h)) || '',
            depTime: headers.find((h) => /dep_time|partida|saida/i.test(h)) || '',
            arrTime: headers.find((h) => /arr_time|chegada|pouso/i.test(h)) || '',
            duration: headers.find((h) => /durat|duracao/i.test(h)) || '',
            airline: headers.find((h) => /airl|cia|companhia/i.test(h)) || '',
            aircraft: headers.find((h) => /airc|aeronave|modelo/i.test(h)) || '',
            registration: headers.find((h) => /reg|prefixo|matricula/i.test(h)) || '',
            seatNumber: headers.find((h) => /seat|assento|poltrona/i.test(h)) || '',
            note: headers.find((h) => /note|obs|notas/i.test(h)) || '',
          };

          setColumnMap(autoMap);
          setShowMappingStep(true);
          setStatusMsg('Dados obtidos com sucesso do Google Sheets! Confirme o de/para abaixo.');
        },
        error: (err) => {
          setIsSyncingSheets(false);
          console.error(err);
          setStatusMsg('Não foi possível ler a planilha. Verifique se a planilha está marcada como Pública.');
        },
      });
    } catch (err) {
      setIsSyncingSheets(false);
      console.error(err);
      setStatusMsg('Erro de conexão com o Google Sheets. Certifique-se de publicar em CSV ("Arquivo > Compartilhar > Publicar na Web").');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full max-w-2xl p-6 border rounded-2xl shadow-2xl relative transition-all max-h-[90vh] overflow-y-auto ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <button
            onClick={() => {
              setShowMappingStep(false);
              onClose();
            }}
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
                {showMappingStep ? 'Conciliação de Colunas ("De / Para")' : 'Importar & Sincronizar Voos'}
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {showMappingStep
                  ? 'Vincule cada coluna da sua planilha às colunas padrão do FlyDiary'
                  : 'my.Flightradar24, Excel, Google Sheets ou arquivo CSV'}
              </p>
            </div>
          </div>

          {/* STEP 2: COLUMN MAPPING SCREEN ("DE / PARA") */}
          {showMappingStep ? (
            <div className="space-y-5">
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                isDarkMode ? 'bg-[#EC6726]/10 border-[#EC6726]/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <Table className="w-4 h-4 text-[#EC6726] shrink-0" />
                <span>
                  Foram encontradas <strong>{parsedRawRows.length} linhas</strong> e <strong>{csvHeaders.length} colunas</strong> na sua planilha. Mapeie abaixo quais colunas correspondem a cada campo do FlyDiary.
                </span>
              </div>

              {/* Column Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                {[
                  { key: 'date', label: 'Data do Voo *', required: true, hint: 'Ex: 2026-05-15' },
                  { key: 'flightNumber', label: 'Número do Voo', hint: 'Ex: LA3021, G31420' },
                  { key: 'from', label: 'Origem (IATA) *', required: true, hint: 'Ex: GRU, CGH, SDU' },
                  { key: 'to', label: 'Destino (IATA) *', required: true, hint: 'Ex: BSB, VCP, CNF' },
                  { key: 'depTime', label: 'Horário de Saída', hint: 'Ex: 08:30:00' },
                  { key: 'arrTime', label: 'Horário de Chegada', hint: 'Ex: 09:30:00' },
                  { key: 'duration', label: 'Duração do Voo', hint: 'Ex: 01:00:00' },
                  { key: 'airline', label: 'Companhia Aérea', hint: 'Ex: LATAM, Gol, Azul' },
                  { key: 'aircraft', label: 'Modelo de Aeronave', hint: 'Ex: Airbus A320neo, B737' },
                  { key: 'registration', label: 'Prefixo / Matrícula', hint: 'Ex: PR-XBB, PS-AE1' },
                  { key: 'seatNumber', label: 'Assento', hint: 'Ex: 12A, 04F' },
                  { key: 'note', label: 'Observações', hint: 'Ex: Notas adicionais' },
                ].map((field) => (
                  <div key={field.key} className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-[11px] font-bold mb-1 flex items-center justify-between">
                      <span className={field.required ? 'text-[#EC6726]' : isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                        {field.label}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">{field.hint}</span>
                    </label>

                    <select
                      value={columnMap[field.key as keyof ColumnMapping] || ''}
                      onChange={(e) =>
                        setColumnMap({ ...columnMap, [field.key]: e.target.value })
                      }
                      className={`w-full py-1.5 px-2 text-xs rounded-lg border focus:outline-none focus:border-[#EC6726] ${
                        isDarkMode
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">-- Selecionar Coluna --</option>
                      {csvHeaders.map((header) => (
                        <option key={header} value={header}>
                          Planilha: {header}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Sample Live Preview Table */}
              {parsedRawRows.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono font-bold text-[#EC6726] uppercase">
                    Pré-visualização da Conciliação (3 Primeiras Linhas)
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 text-[11px]">
                    <table className="w-full text-left font-mono">
                      <thead className={isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                        <tr>
                          <th className="p-2">Data</th>
                          <th className="p-2">Voo</th>
                          <th className="p-2">Rota</th>
                          <th className="p-2">Companhia</th>
                          <th className="p-2">Aeronave</th>
                          <th className="p-2">Prefixo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {parsedRawRows.slice(0, 3).map((row, i) => (
                          <tr key={i} className={isDarkMode ? 'bg-slate-900/50' : 'bg-white'}>
                            <td className="p-2 text-[#EC6726] font-bold">
                              {columnMap.date && row[columnMap.date] ? row[columnMap.date] : '—'}
                            </td>
                            <td className="p-2">
                              {columnMap.flightNumber && row[columnMap.flightNumber] ? row[columnMap.flightNumber] : '—'}
                            </td>
                            <td className="p-2 font-bold">
                              {columnMap.from && row[columnMap.from] ? row[columnMap.from] : '??'} →{' '}
                              {columnMap.to && row[columnMap.to] ? row[columnMap.to] : '??'}
                            </td>
                            <td className="p-2">
                              {columnMap.airline && row[columnMap.airline] ? row[columnMap.airline] : '—'}
                            </td>
                            <td className="p-2">
                              {columnMap.aircraft && row[columnMap.aircraft] ? row[columnMap.aircraft] : '—'}
                            </td>
                            <td className="p-2 text-amber-400">
                              {columnMap.registration && row[columnMap.registration] ? row[columnMap.registration] : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowMappingStep(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={() => processParsedDataWithMap(parsedRawRows, columnMap)}
                  className="px-5 py-2.5 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirmar Conciliação & Importar
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: SELECT SOURCE SOURCE TABS */
            <div>
              {/* Source Tabs */}
              <div className={`flex border-b mb-5 overflow-x-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <button
                  onClick={() => setActiveTab('myflightradar')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'myflightradar'
                      ? 'border-[#EC6726] text-[#EC6726]'
                      : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
                  }`}
                >
                  my.Flightradar24 CSV
                </button>

                <button
                  onClick={() => setActiveTab('custom')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'custom'
                      ? 'border-[#EC6726] text-[#EC6726]'
                      : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
                  }`}
                >
                  Excel + Mapeamento ("De / Para")
                </button>

                <button
                  onClick={() => setActiveTab('googlesheets')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'googlesheets'
                      ? 'border-[#EC6726] text-[#EC6726]'
                      : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
                  }`}
                >
                  Google Sheets (Link Live)
                </button>

                <button
                  onClick={() => setActiveTab('text')}
                  className={`pb-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'text'
                      ? 'border-[#EC6726] text-[#EC6726]'
                      : isDarkMode ? 'border-transparent text-slate-400' : 'border-transparent text-slate-500'
                  }`}
                >
                  Colar Texto CSV
                </button>
              </div>

              {/* TAB 1: MYFLIGHTRADAR24 */}
              {activeTab === 'myflightradar' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <p className="font-semibold text-[#EC6726] mb-1">Exportação nativa do my.flightradar24:</p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px]">
                      <li>Acesse sua conta em <strong>my.flightradar24.com</strong></li>
                      <li>Clique em <strong>Settings</strong> &gt; <strong>Export</strong></li>
                      <li>Baixe seu arquivo <code>.csv</code> e selecione-o no botão abaixo.</li>
                    </ol>
                  </div>

                  <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDarkMode
                      ? 'border-slate-800 hover:border-[#EC6726]/60 bg-slate-950/50'
                      : 'border-slate-200 hover:border-[#EC6726]/60 bg-slate-50'
                  }`}>
                    <Upload className="w-7 h-7 text-[#EC6726] mx-auto mb-2" />
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Selecione o arquivo CSV do my.Flightradar24
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">Formatos aceitos: .csv</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUploadAndOpenMapping}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* TAB 2: EXCEL + "DE / PARA" MAPPING */}
              {activeTab === 'custom' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-bold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        Upload com De/Para Automático
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Mesmo que suas colunas tenham nomes diferentes, nosso conciliador relacionará cada campo!
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="px-3 py-1.5 rounded-lg bg-[#EC6726]/10 text-[#EC6726] border border-[#EC6726]/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-[#EC6726]/20 transition-colors cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar Modelo
                    </button>
                  </div>

                  <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    isDarkMode
                      ? 'border-slate-800 hover:border-[#EC6726]/60 bg-slate-950/50'
                      : 'border-slate-200 hover:border-[#EC6726]/60 bg-slate-50'
                  }`}>
                    <Database className="w-7 h-7 text-[#EC6726] mx-auto mb-2" />
                    <span className={`text-xs font-bold block ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      Enviar Planilha Excel ou CSV
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      Abre a tela de conciliação de colunas "De / Para"
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUploadAndOpenMapping}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* TAB 3: GOOGLE SHEETS LIVE SYNC */}
              {activeTab === 'googlesheets' && (
                <div className="space-y-4">
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <p className="font-semibold text-[#EC6726] mb-1 flex items-center gap-1.5">
                      <Link className="w-4 h-4" /> Integração com Google Sheets:
                    </p>
                    <p className="text-[11px] mb-2">
                      Cole a URL da sua planilha publicada na Web no Google Sheets. Sempre que você adicionar novos voos na planilha online, o FlyDiary sincronizará os dados!
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Instruções: No Google Sheets, vá em <strong>Arquivo &gt; Compartilhar &gt; Publicar na web &gt; Escolha "Valores separados por vírgulas (.csv)"</strong> e cole o link abaixo.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold">URL da Planilha Google Sheets ou ID</label>
                    <input
                      type="url"
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/1eX.../pub?output=csv"
                      className={`w-full p-2.5 text-xs border rounded-xl focus:border-[#EC6726] focus:outline-none ${
                        isDarkMode
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />

                    <button
                      type="button"
                      disabled={isSyncingSheets}
                      onClick={handleGoogleSheetsSync}
                      className="w-full py-2.5 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-bold text-xs shadow-md shadow-[#EC6726]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                      {isSyncingSheets ? 'Sincronizando...' : 'Conectar & Sincronizar Google Sheets'}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: RAW CSV TEXT */}
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
                    onClick={() => {
                      Papa.parse(csvText, {
                        header: true,
                        skipEmptyLines: true,
                        complete: (res) => {
                          setCsvHeaders(res.meta.fields || []);
                          setParsedRawRows(res.data);
                          setShowMappingStep(true);
                        },
                      });
                    }}
                    className="w-full py-2 rounded-xl bg-[#EC6726] hover:bg-[#d9581d] text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Table className="w-4 h-4" /> Processar Texto & Mapear Colunas
                  </button>
                </div>
              )}
            </div>
          )}

          {statusMsg && (
            <p className="mt-4 text-xs font-mono font-medium text-[#EC6726] flex items-center gap-1.5 p-2.5 rounded-xl bg-[#EC6726]/10 border border-[#EC6726]/30">
              <Sparkles className="w-4 h-4 text-[#EC6726]" /> {statusMsg}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setShowMappingStep(false);
                onClose();
              }}
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
