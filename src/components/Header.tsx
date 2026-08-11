import React from 'react';
import { ActiveTab } from '../types/prestasi';
import { ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  isAdminLoggedIn: boolean;
  onOpenAdminPin: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isAdminLoggedIn,
  onOpenAdminPin,
  onLogoutAdmin,
}) => {
  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'input':
        return 'Pendataan Prestasi Siswa';
      case 'status':
        return 'Notifikasi & Status Verifikasi';
      case 'publik':
        return 'Direktori & Transparansi Prestasi SMADA';
      case 'admin':
        return 'Dashboard Administrasi Kesiswaan';
      default:
        return 'HIMPRES SMADA';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-xs z-10">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-400 font-medium">HIMPRES SMADA</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-800">{getBreadcrumbTitle()}</span>
        <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium ml-2">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          by bidang kesiswaan
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Real-time status indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-medium text-slate-700">Real-Time Sync Active</span>
        </div>

        {isAdminLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Sesi Admin Aktif
            </span>
            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
            >
              Logout Admin
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAdminPin}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Masuk Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
