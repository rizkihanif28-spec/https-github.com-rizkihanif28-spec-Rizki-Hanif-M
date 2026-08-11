import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Eye, EyeOff, AlertCircle, X, HelpCircle } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.trim() === 'Kesiswaan2026') {
      onSuccessLogin();
      setPin('');
      setError('');
      onClose();
    } else {
      setError('PIN Admin salah. Silakan coba lagi atau gunakan PIN Rujukan.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-yellow-400 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900">Autentikasi Tim Kesiswaan</h2>
          <p className="text-xs text-slate-500">
            Masukkan PIN Khusus Administrasi SMAN 2 Kota Pasuruan untuk mengakses Dashboard Verifikasi &amp; Live Spreadsheet.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" /> PIN Akses Admin Kesiswaan
              </span>
            </label>

            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Masukkan PIN Admin Kesiswaan"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>Masuk Dashboard Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
