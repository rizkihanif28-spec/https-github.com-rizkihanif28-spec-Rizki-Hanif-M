import React, { useState, useEffect } from 'react';
import { ActiveTab, KategoriPrestasi } from './types/prestasi';
import { getStoredPrestasi } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FormInputSiswa } from './components/FormInputSiswa';
import { StatusVerifikasiSiswa } from './components/StatusVerifikasiSiswa';
import { DirektoriPublic } from './components/DirektoriPublic';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminPinModal } from './components/AdminPinModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('input');
  const [initialKategori, setInitialKategori] = useState<KategoriPrestasi>('Akademik');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [statusSearchEmail, setStatusSearchEmail] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  // Responsive Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Calculate pending verification count for badge
  useEffect(() => {
    const updateCount = () => {
      const data = getStoredPrestasi();
      setPendingCount(data.filter((i) => i.status === 'Menunggu').length);
    };
    updateCount();

    window.addEventListener('sipp_smada_data_updated', updateCount);
    return () => {
      window.removeEventListener('sipp_smada_data_updated', updateCount);
    };
  }, []);

  const handleOpenAdminPin = () => {
    setIsAdminPinModalOpen(true);
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    if (activeTab === 'admin') {
      setActiveTab('input');
    }
  };

  const handleSuccessAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setActiveTab('admin');
  };

  const handleFormSuccessSubmit = (submittedEmail: string) => {
    setStatusSearchEmail(submittedEmail);
    setActiveTab('status');
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminPin={handleOpenAdminPin}
        onLogoutAdmin={handleLogoutAdmin}
        pendingCount={pendingCount}
        initialKategori={initialKategori}
        setInitialKategori={setInitialKategori}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminPin={handleOpenAdminPin}
          onLogoutAdmin={handleLogoutAdmin}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        {/* Dynamic View Sections */}
        <section className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'input' && (
            <FormInputSiswa
              initialKategori={initialKategori}
              onSuccessSubmit={handleFormSuccessSubmit}
            />
          )}

          {activeTab === 'status' && (
            <StatusVerifikasiSiswa
              initialSearchEmail={statusSearchEmail}
              onNavigateFormInput={() => setActiveTab('input')}
            />
          )}

          {activeTab === 'publik' && <DirektoriPublic />}

          {activeTab === 'admin' && (
            isAdminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner font-black text-xl">
                  🔒
                </div>
                <h2 className="text-xl font-bold text-slate-900">Akses Terkunci (Admin)</h2>
                <p className="text-xs text-slate-500">
                  Masukkan PIN Khusus Kesiswaan untuk mengelola rekapitulasi data prestasi siswa SMAN 2 Kota Pasuruan.
                </p>
                <button
                  onClick={handleOpenAdminPin}
                  className="px-6 py-3 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-950 transition-colors shadow-md w-full"
                >
                  Buka PIN Admin
                </button>
              </div>
            )
          )}
        </section>

        {/* Global Footer */}
        <footer className="py-2.5 px-6 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white shrink-0 font-semibold tracking-wide shadow-xs">
          (app by Rizki Hanif Mahardika, M.Pd.)
        </footer>
      </main>

      {/* Admin PIN Authentication Modal */}
      <AdminPinModal
        isOpen={isAdminPinModalOpen}
        onClose={() => setIsAdminPinModalOpen(false)}
        onSuccessLogin={handleSuccessAdminLogin}
      />
    </div>
  );
}
