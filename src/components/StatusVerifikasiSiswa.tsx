import React, { useState, useEffect } from 'react';
import { PrestasiSiswa } from '../types/prestasi';
import { getStoredPrestasi, getNotifications } from '../utils/storage';
import {
  Search,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Eye,
  RefreshCw,
  Trophy,
  Filter,
  X
} from 'lucide-react';

interface StatusVerifikasiSiswaProps {
  initialSearchEmail?: string;
  onNavigateFormInput: () => void;
}

export const StatusVerifikasiSiswa: React.FC<StatusVerifikasiSiswaProps> = ({
  initialSearchEmail = '',
  onNavigateFormInput,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchEmail);
  const [allData, setAllData] = useState<PrestasiSiswa[]>([]);
  const [selectedItem, setSelectedItem] = useState<PrestasiSiswa | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const loadData = () => {
    const data = getStoredPrestasi();
    setAllData(data);
    setLastRefreshed(new Date().toLocaleTimeString('id-ID'));
  };

  useEffect(() => {
    loadData();

    // Listen to real-time storage event triggers
    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('sipp_smada_data_updated', handleUpdate);
    window.addEventListener('sipp_smada_notif_updated', handleUpdate);

    return () => {
      window.removeEventListener('sipp_smada_data_updated', handleUpdate);
      window.removeEventListener('sipp_smada_notif_updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (initialSearchEmail) {
      setSearchQuery(initialSearchEmail);
    }
  }, [initialSearchEmail]);

  // Filter student items based on query
  const filteredItems = allData.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.email.toLowerCase().includes(q) ||
      item.namaSiswa.toLowerCase().includes(q) ||
      item.noTelp.includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.namaKejuaraan.toLowerCase().includes(q)
    );
  });

  const notifs = getNotifications();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Real-time Notification Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 shadow-inner">
            <Bell className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Status Verifikasi & Notifikasi Siswa</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                ● Live Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cari menggunakan Email, Nama, atau No. Telp siswa SMAN 2 Pasuruan untuk mengecek riwayat pengajuan.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors self-start md:self-auto shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Data ({lastRefreshed})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Cari berdasarkan Email (fauzi.ahmad@smada.sch.id), Nama, atau No. WA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* System Notifications Alert Feed */}
      {notifs.length > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-indigo-600" />
            Aktivitas Verifikasi Terakhir dari Kesiswaan
          </div>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {notifs.slice(0, 3).map((n) => (
              <div key={n.id} className="bg-white p-2.5 rounded-xl border border-indigo-100 text-xs flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${n.newStatus === 'Disetujui' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className="font-bold text-slate-800">{n.studentName}</span>
                  <span className="text-slate-500">• {n.namaKejuaraan}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className={`font-bold px-2 py-0.5 rounded ${n.newStatus === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {n.newStatus}
                  </span>
                  <span className="text-slate-400">{new Date(n.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>Menampilkan {filteredItems.length} Pengajuan Prestasi</span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-indigo-600 hover:underline">
              Reset Pencarian
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">Data Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tidak ada data prestasi yang cocok dengan pencarian &quot;{searchQuery}&quot;. Silakan periksa kembali kata kunci atau input data prestasi baru.
              </p>
            </div>
            <button
              onClick={onNavigateFormInput}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              + Input Prestasi Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  {/* Category & Status badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-wide">
                      {item.kategori}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                      item.jenjang === 'Internasional' ? 'bg-amber-100 text-amber-800' :
                      item.jenjang === 'Nasional' ? 'bg-blue-100 text-blue-800' :
                      item.jenjang === 'Provinsi' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {item.jenjang}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                      🏆 {item.hasil}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {item.namaKejuaraan}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">{item.namaSiswa}</span> ({item.kelas}) • {item.email}
                    </p>
                  </div>

                  {/* Verification Note if rejected or approved */}
                  {item.catatanVerifikasi && (
                    <div className={`p-2.5 rounded-xl text-xs ${
                      item.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60' :
                      item.status === 'Ditolak' ? 'bg-rose-50 text-rose-800 border border-rose-200/60' : 'bg-slate-50 text-slate-700'
                    }`}>
                      <span className="font-bold">Catatan Kesiswaan: </span>
                      <span>{item.catatanVerifikasi}</span>
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    ID: <span className="font-mono text-slate-600">{item.id}</span> • Tanggal Sertifikat: {item.tanggalSertifikat}
                  </div>
                </div>

                {/* Status Column & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3 shrink-0">
                  {item.status === 'Disetujui' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Disetujui
                    </span>
                  )}
                  {item.status === 'Menunggu' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 shadow-2xs">
                      <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                      Menunggu Verifikasi
                    </span>
                  )}
                  {item.status === 'Ditolak' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 shadow-2xs">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Ditolak
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Detail</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Detail Sertifikat */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-bold uppercase">{selectedItem.id}</span>
                <h3 className="text-lg font-bold text-slate-900">Detail Pendataan Prestasi</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">NAMA SISWA</span>
                  <span className="font-bold text-slate-900">{selectedItem.namaSiswa}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">KELAS</span>
                  <span className="font-bold text-slate-900">{selectedItem.kelas}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EMAIL</span>
                  <span className="font-medium text-slate-800">{selectedItem.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">NO TELEPON</span>
                  <span className="font-medium text-slate-800">{selectedItem.noTelp}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">KEJUARAAN</span>
                <div className="font-bold text-slate-900 text-sm">{selectedItem.namaKejuaraan}</div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded">
                    {selectedItem.kategori}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">
                    {selectedItem.jenjang} • {selectedItem.hasil}
                  </span>
                </div>
              </div>

              {/* Sertifikat File Display */}
              <div className="pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">BERKAS SERTIFIKAT</span>
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{selectedItem.sertifikat.namaFile}</span>
                  </div>
                  {selectedItem.sertifikat.dataBase64 ? (
                    <a
                      href={selectedItem.sertifikat.dataBase64}
                      download={selectedItem.sertifikat.namaFile}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-indigo-700 transition-colors shrink-0"
                    >
                      Buka File
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium italic">Tersimpan di sistem</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl text-xs hover:bg-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
