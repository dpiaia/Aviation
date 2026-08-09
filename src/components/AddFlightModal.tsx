import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Plane } from 'lucide-react';
import { Flight } from '../types';

interface AddFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFlight: (flight: Flight) => void;
}

export const AddFlightModal: React.FC<AddFlightModalProps> = ({
  isOpen,
  onClose,
  onAddFlight,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    flightNumber: '',
    from: '',
    to: '',
    depTime: '12:00:00',
    arrTime: '13:30:00',
    duration: '01:30:00',
    airline: 'Azul Brazilian Airlines (AD/AZU)',
    aircraft: 'Embraer Embraer E195-E2 (E295)',
    registration: '',
    seatNumber: '',
    note: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlight: Flight = {
      id: `f-user-${Date.now()}`,
      ...formData,
      seatType: '1',
      flightClass: '1',
      flightReason: '0',
    };
    onAddFlight(newFlight);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Plane className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Adicionar Novo Voo
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Data do Voo *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Número do Voo
                </label>
                <input
                  type="text"
                  placeholder="Ex: AD4558"
                  value={formData.flightNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, flightNumber: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Origem *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campinas / Viracopos (VCP)"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Destino *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Joinville (JOI)"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Aeronave *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Embraer Embraer E195-E2 (E295) ou ATR 72-600"
                value={formData.aircraft}
                onChange={(e) => setFormData({ ...formData, aircraft: e.target.value })}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Matrícula
                </label>
                <input
                  type="text"
                  placeholder="Ex: PS-AER"
                  value={formData.registration}
                  onChange={(e) =>
                    setFormData({ ...formData, registration: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Duração
                </label>
                <input
                  type="text"
                  placeholder="01:10:00"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Assento
                </label>
                <input
                  type="text"
                  placeholder="Ex: 28D"
                  value={formData.seatNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, seatNumber: e.target.value })
                  }
                  className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Companhia Aérea
              </label>
              <input
                type="text"
                placeholder="Ex: Azul Brazilian Airlines (AD/AZU)"
                value={formData.airline}
                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Observações
              </label>
              <textarea
                rows={2}
                placeholder="Notas sobre o voo, conforto do assento, etc."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Cadastrar Voo
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
