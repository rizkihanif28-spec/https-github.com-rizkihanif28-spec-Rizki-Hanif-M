import React from 'react';
import { ActiveTab } from '../types/prestasi';
import { Sparkles, CheckCircle2, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  isAdminLoggedIn: boolean;
  onOpenAdminPin: () => void;
  onLogoutAdmin: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isAdminLoggedIn,
  onOpenAdminPin,
  onLogoutAdmin,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  setIsMobileSidebarOpen,
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
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
      <div className="flex items-center gap-2.5 sm:gap-3 text-sm">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
          title="Buka Menu"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors focus:outline-none"
          title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Kecilkan Sidebar'}
          aria-label="Toggle Desktop Sidebar"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-indigo-600" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <span className="text-slate-400 font-medium hidden sm:inline">HIMPRES SMADA</span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="font-semibold text-slate-800 text-xs sm:text-sm truncate max-w-[180px] xs:max-w-xs sm:max-w-none">
          {getBreadcrumbTitle()}
        </span>
        <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium ml-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          by bidang kesiswaan
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Real-time status indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-medium text-slate-700">Real-Time Sync Active</span>
        </div>

        {isAdminLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Admin
            </span>
            <button
              onClick={onLogoutAdmin}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAdminPin}
            className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Masuk Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};

