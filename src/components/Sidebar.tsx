import React from 'react';
import { ActiveTab } from '../types/prestasi';
import { GraduationCap, Award, Bell, ShieldCheck, Globe, Trophy } from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminPin: () => void;
  onLogoutAdmin: () => void;
  pendingCount: number;
  initialKategori?: 'Akademik' | 'Non-Akademik';
  setInitialKategori?: (cat: 'Akademik' | 'Non-Akademik') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onOpenAdminPin,
  onLogoutAdmin,
  pendingCount,
  setInitialKategori
}) => {
  return (
    <aside className="w-64 bg-indigo-950 text-white flex flex-col shrink-0 shadow-xl border-r border-indigo-900/50 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-indigo-900/60 bg-indigo-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/40 border border-indigo-400/30">
            <Trophy className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white leading-tight">HIMPRES SMADA</div>
            <div className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase mt-0.5">
              by bidang kesiswaan
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] uppercase text-indigo-400 font-extrabold px-3 pt-2 pb-1 tracking-wider">
          Menu Siswa
        </div>

        <button
          onClick={() => {
            if (setInitialKategori) setInitialKategori('Akademik');
            setActiveTab('input');
          }}
          className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 text-sm font-medium ${
            activeTab === 'input'
              ? 'bg-indigo-800 text-white shadow-md border-l-4 border-yellow-400'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>Input Akademik</span>
          </div>
          <span className="text-[10px] bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
            Form
          </span>
        </button>

        <button
          onClick={() => {
            if (setInitialKategori) setInitialKategori('Non-Akademik');
            setActiveTab('input');
          }}
          className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 text-sm font-medium ${
            activeTab === 'input'
              ? 'bg-indigo-800 text-white shadow-md'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Input Non-Akademik</span>
          </div>
          <span className="text-[10px] bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
            Form
          </span>
        </button>

        <button
          onClick={() => setActiveTab('status')}
          className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 text-sm font-medium ${
            activeTab === 'status'
              ? 'bg-indigo-800 text-white shadow-md border-l-4 border-yellow-400'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>Status Verifikasi</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            Realtime
          </span>
        </button>

        <button
          onClick={() => setActiveTab('publik')}
          className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 text-sm font-medium ${
            activeTab === 'publik'
              ? 'bg-indigo-800 text-white shadow-md border-l-4 border-yellow-400'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Direktori Prestasi</span>
          </div>
          <span className="text-[10px] bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full">
            Publik
          </span>
        </button>

        <div className="pt-6 text-[10px] uppercase text-indigo-400 font-extrabold px-3 pb-1 tracking-wider">
          Administrasi SMAN 2
        </div>

        {isAdminLoggedIn ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 text-sm font-medium border-l-4 border-yellow-400 shadow-sm ${
              activeTab === 'admin'
                ? 'bg-indigo-700 text-white ring-1 ring-indigo-500/50'
                : 'bg-indigo-900/80 text-white hover:bg-indigo-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>Admin Dashboard</span>
            </div>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-extrabold text-xs px-2 py-0.5 rounded-full animate-pulse shadow">
                {pendingCount}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={onOpenAdminPin}
            className="w-full text-left px-3.5 py-2.5 rounded-lg bg-indigo-900/40 border border-indigo-800/80 text-indigo-200 hover:bg-indigo-900 hover:text-white flex items-center justify-between transition-all duration-200 text-sm font-medium group"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:text-yellow-400 transition-colors" />
              <span>Login Admin</span>
            </div>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-mono">
              PIN
            </span>
          </button>
        )}
      </nav>

      {/* Footer Profile / Admin Status */}
      <div className="p-4 border-t border-indigo-900/80 bg-indigo-950/90">
        <div className="flex items-center justify-between bg-indigo-900/50 p-2.5 rounded-xl border border-indigo-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-indigo-950 font-black text-xs shadow-sm">
              {isAdminLoggedIn ? 'A' : 'S'}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {isAdminLoggedIn ? 'Kesiswaan SMADA' : 'Siswa SMAN 2'}
              </div>
              <div className="text-[10px] text-indigo-300 font-medium">
                {isAdminLoggedIn ? 'Admin Verified' : 'Kota Pasuruan'}
              </div>
            </div>
          </div>

          {isAdminLoggedIn && (
            <button
              onClick={onLogoutAdmin}
              title="Logout Admin"
              className="text-[10px] bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 px-2 py-1 rounded transition-colors"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
