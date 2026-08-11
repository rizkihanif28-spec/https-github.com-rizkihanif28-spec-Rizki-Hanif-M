import React from 'react';
import { ActiveTab } from '../types/prestasi';
import {
  GraduationCap,
  Award,
  Bell,
  ShieldCheck,
  Globe,
  Trophy,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminPin: () => void;
  onLogoutAdmin: () => void;
  pendingCount: number;
  initialKategori?: 'Akademik' | 'Non-Akademik';
  setInitialKategori?: (cat: 'Akademik' | 'Non-Akademik') => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onOpenAdminPin,
  onLogoutAdmin,
  pendingCount,
  setInitialKategori,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const handleNavClick = (tab: ActiveTab, category?: 'Akademik' | 'Non-Akademik') => {
    if (category && setInitialKategori) {
      setInitialKategori(category);
    }
    setActiveTab(tab);
    setIsMobileSidebarOpen(false); // Auto close mobile drawer on tab click
  };

  const navContent = (isCollapsed: boolean) => (
    <>
      {/* Brand Header */}
      <div className={`p-4 sm:p-5 border-b border-indigo-900/60 bg-indigo-950/80 backdrop-blur-sm flex items-center justify-between ${isCollapsed ? 'flex-col gap-3 px-2 text-center' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/40 border border-indigo-400/30 shrink-0">
            <Trophy className="w-5 h-5 text-yellow-300" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight truncate">
                HIMPRES SMADA
              </div>
              <div className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase mt-0.5 truncate">
                by bidang kesiswaan
              </div>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle button inside header */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-900/80 transition-colors focus:outline-none shrink-0"
          title={isCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-900/80 transition-colors focus:outline-none"
          title="Tutup Menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {!isCollapsed ? (
          <div className="text-[10px] uppercase text-indigo-400 font-extrabold px-3 pt-2 pb-1 tracking-wider">
            Menu Siswa
          </div>
        ) : (
          <div className="h-2"></div>
        )}

        {/* Input Akademik */}
        <button
          onClick={() => handleNavClick('input', 'Akademik')}
          title={isCollapsed ? 'Input Akademik' : undefined}
          className={`w-full text-left rounded-xl transition-all duration-200 text-sm font-medium flex items-center ${
            isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
          } ${
            activeTab === 'input'
              ? 'bg-indigo-800 text-white shadow-md border-l-4 border-yellow-400'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-indigo-300 shrink-0" />
            {!isCollapsed && <span>Input Akademik</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              Form
            </span>
          )}
        </button>

        {/* Input Non-Akademik */}
        <button
          onClick={() => handleNavClick('input', 'Non-Akademik')}
          title={isCollapsed ? 'Input Non-Akademik' : undefined}
          className={`w-full text-left rounded-xl transition-all duration-200 text-sm font-medium flex items-center ${
            isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
          } ${
            activeTab === 'input'
              ? 'bg-indigo-800 text-white shadow-md'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-300 shrink-0" />
            {!isCollapsed && <span>Input Non-Akademik</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] bg-indigo-900/80 border border-indigo-700/60 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
              Form
            </span>
          )}
        </button>

        {/* Status Verifikasi */}
        <button
          onClick={() => handleNavClick('status')}
          title={isCollapsed ? 'Status Verifikasi' : undefined}
          className={`w-full text-left rounded-xl transition-all duration-200 text-sm font-medium flex items-center ${
            isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
          } ${
            activeTab === 'status'
              ? 'bg-indigo-800 text-white shadow-md border-l-4 border-yellow-400'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-emerald-400 shrink-0" />
            {!isCollapsed && <span>Status Verifikasi</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              Realtime
            </span>
          )}
        </button>

        {/* Direktori Prestasi Publik */}
        <button
          onClick={() => handleNavClick('publik')}
          title={isCollapsed ? 'Direktori Prestasi' : undefined}
          className={`w-full text-left rounded-xl transition-all duration-200 text-sm font-medium flex items-center ${
            isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
          } ${
            activeTab === 'publik'
              ? 'bg-indigo-800 text-white shadow-md border-l-4 border-yellow-400'
              : 'text-indigo-200 hover:bg-indigo-900/70 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-sky-400 shrink-0" />
            {!isCollapsed && <span>Direktori Prestasi</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full">
              Publik
            </span>
          )}
        </button>

        {!isCollapsed ? (
          <div className="pt-6 text-[10px] uppercase text-indigo-400 font-extrabold px-3 pb-1 tracking-wider">
            Administrasi SMAN 2
          </div>
        ) : (
          <div className="pt-4 border-t border-indigo-900/50 my-2"></div>
        )}

        {/* Admin Section */}
        {isAdminLoggedIn ? (
          <button
            onClick={() => handleNavClick('admin')}
            title={isCollapsed ? `Admin Dashboard (${pendingCount} pending)` : undefined}
            className={`w-full text-left rounded-xl transition-all duration-200 text-sm font-medium flex items-center border-l-4 border-yellow-400 shadow-sm relative ${
              isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
            } ${
              activeTab === 'admin'
                ? 'bg-indigo-700 text-white ring-1 ring-indigo-500/50'
                : 'bg-indigo-900/80 text-white hover:bg-indigo-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
              {!isCollapsed && <span>Admin Dashboard</span>}
            </div>
            {!isCollapsed && pendingCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-extrabold text-xs px-2 py-0.5 rounded-full animate-pulse shadow">
                {pendingCount}
              </span>
            )}
            {isCollapsed && pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-extrabold text-[9px] flex items-center justify-center rounded-full animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => {
              onOpenAdminPin();
              setIsMobileSidebarOpen(false);
            }}
            title={isCollapsed ? 'Login Admin' : undefined}
            className={`w-full text-left rounded-xl bg-indigo-900/40 border border-indigo-800/80 text-indigo-200 hover:bg-indigo-900 hover:text-white flex items-center transition-all duration-200 text-sm font-medium group ${
              isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 group-hover:text-yellow-400 transition-colors shrink-0" />
              {!isCollapsed && <span>Login Admin</span>}
            </div>
            {!isCollapsed && (
              <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-mono">
                PIN
              </span>
            )}
          </button>
        )}
      </nav>

      {/* Footer Profile / Admin Status */}
      <div className="p-3 sm:p-4 border-t border-indigo-900/80 bg-indigo-950/90">
        <div className={`flex items-center bg-indigo-900/50 p-2.5 rounded-xl border border-indigo-800/60 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 flex items-center justify-center text-indigo-950 font-black text-xs shadow-sm shrink-0"
              title={isAdminLoggedIn ? 'Kesiswaan SMADA' : 'Siswa SMAN 2'}
            >
              {isAdminLoggedIn ? 'A' : 'S'}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {isAdminLoggedIn ? 'Kesiswaan SMADA' : 'Siswa SMAN 2'}
                </div>
                <div className="text-[10px] text-indigo-300 font-medium truncate">
                  {isAdminLoggedIn ? 'Admin Verified' : 'Kota Pasuruan'}
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && isAdminLoggedIn && (
            <button
              onClick={() => {
                onLogoutAdmin();
                setIsMobileSidebarOpen(false);
              }}
              title="Logout Admin"
              className="text-[10px] bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50 px-2 py-1 rounded transition-colors shrink-0"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Sidebar (md and above) */}
      <aside
        className={`hidden md:flex flex-col bg-indigo-950 text-white shrink-0 shadow-xl border-r border-indigo-900/50 select-none z-20 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {navContent(isSidebarCollapsed)}
      </aside>

      {/* 2. Mobile Drawer Backdrop (below md) */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Drawer Sidebar (below md) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-indigo-950 text-white flex flex-col shadow-2xl md:hidden transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent(false)}
      </aside>
    </>
  );
};
