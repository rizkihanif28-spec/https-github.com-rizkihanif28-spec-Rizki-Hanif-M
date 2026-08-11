import React, { useState, useEffect } from 'react';
import { PrestasiSiswa, StatusVerifikasi, KategoriPrestasi, JenjangPrestasi, HasilKejuaraan } from '../types/prestasi';
import { getStoredPrestasi, savePrestasiData, updatePrestasi, deletePrestasi, addNotification, addPrestasi } from '../utils/storage';
import { exportToExcel } from '../utils/excel';
import {
  FileSpreadsheet,
  Download,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Plus,
  RefreshCw,
  Save,
  Check,
  X,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<PrestasiSiswa[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'spreadsheet'>('table');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterJenjang, setFilterJenjang] = useState<string>('Semua');

  // Modals state
  const [editItem, setEditItem] = useState<PrestasiSiswa | null>(null);
  const [viewCertificateItem, setViewCertificateItem] = useState<PrestasiSiswa | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<PrestasiSiswa | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Spreadsheet cell editing state
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof PrestasiSiswa } | null>(null);
  const [spreadsheetSaveSuccess, setSpreadsheetSaveSuccess] = useState(false);

  const loadData = () => {
    setData(getStoredPrestasi());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('sipp_smada_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('sipp_smada_data_updated', handleUpdate);
    };
  }, []);

  // Filtered dataset
  const filteredData = data.filter((item) => {
    if (filterKategori !== 'Semua' && item.kategori !== filterKategori) return false;
    if (filterStatus !== 'Semua' && item.status !== filterStatus) return false;
    if (filterJenjang !== 'Semua' && item.jenjang !== filterJenjang) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.namaSiswa.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.namaKejuaraan.toLowerCase().includes(q) ||
        item.kelas.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Statistics
  const totalCount = data.length;
  const approvedCount = data.filter((d) => d.status === 'Disetujui').length;
  const pendingCount = data.filter((d) => d.status === 'Menunggu').length;
  const rejectedCount = data.filter((d) => d.status === 'Ditolak').length;

  // Actions
  const handleApprove = (item: PrestasiSiswa) => {
    const updated = updatePrestasi(item.id, {
      status: 'Disetujui',
      catatanVerifikasi: 'Telah diverifikasi dan disetujui oleh Tim Kesiswaan SMAN 2 Kota Pasuruan.',
    });
    if (updated) {
      addNotification({
        studentEmail: item.email,
        studentName: item.namaSiswa,
        prestasiId: item.id,
        namaKejuaraan: item.namaKejuaraan,
        oldStatus: item.status,
        newStatus: 'Disetujui',
        message: 'Pengajuan prestasi anda telah DISETUJUI oleh Kesiswaan SMADA.',
      });
      loadData();
    }
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    const updated = updatePrestasi(rejectModalItem.id, {
      status: 'Ditolak',
      catatanVerifikasi: rejectReason.trim() || 'Dokumen belum memenuhi syarat verifikasi kesiswaan.',
    });
    if (updated) {
      addNotification({
        studentEmail: rejectModalItem.email,
        studentName: rejectModalItem.namaSiswa,
        prestasiId: rejectModalItem.id,
        namaKejuaraan: rejectModalItem.namaKejuaraan,
        oldStatus: rejectModalItem.status,
        newStatus: 'Ditolak',
        message: `Pengajuan prestasi ditolak: ${rejectReason}`,
      });
      loadData();
    }
    setRejectModalItem(null);
    setRejectReason('');
  };

  const handleDelete = (id: string, nama: string) => {
    if (confirm(`Apakah anda yakin ingin menghapus data prestasi milik ${nama}?`)) {
      deletePrestasi(id);
      loadData();
    }
  };

  const handleSaveEditModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;
    updatePrestasi(editItem.id, { ...editItem });
    setEditItem(null);
    loadData();
  };

  // Spreadsheet inline cell editing handler
  const handleSpreadsheetCellChange = (id: string, field: keyof PrestasiSiswa, value: string) => {
    const updated = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value,
          diupdatePada: new Date().toISOString(),
        };
      }
      return item;
    });
    setData(updated);
  };

  const handleSaveSpreadsheet = () => {
    savePrestasiData(data);
    setSpreadsheetSaveSuccess(true);
    setTimeout(() => setSpreadsheetSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Stat Cards - Matching Professional Polish Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 shrink-0">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-[11px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Total Input Data</div>
          <div className="text-3xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
            <span>● Realtime terhubung</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Verifikasi Disetujui</div>
          <div className="text-3xl font-black text-emerald-600">{approvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            {totalCount > 0 ? ((approvedCount / totalCount) * 100).toFixed(1) : 0}% dari total pengajuan
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Menunggu Review</div>
          <div className="text-3xl font-black text-amber-500">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium italic">
            Segera diproses Kesiswaan
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 uppercase font-extrabold tracking-wider mb-1">Ditolak</div>
          <div className="text-3xl font-black text-rose-500">{rejectedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Perlu perbaikan berkas
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        {/* Header Controls Bar */}
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              <span>Rekapitulasi Prestasi Siswa SMAN 2 Kota Pasuruan</span>
            </h2>
            <p className="text-xs text-slate-500">
              Gunakan mode Tabel Standar atau Mode Edit Spreadsheet Real-Time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabel Data
              </button>
              <button
                onClick={() => setViewMode('spreadsheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'spreadsheet' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Edit di Spreadsheet</span>
              </button>
            </div>

            {/* Export Excel Button */}
            <button
              onClick={() => exportToExcel(filteredData)}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Format Excel (.xlsx)</span>
            </button>

            {/* Add Manual Record */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data Manual</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar for Table Mode */}
        {viewMode === 'table' && (
          <div className="p-4 bg-white border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama, email, kelas, kejuaraan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Akademik">Akademik</option>
              <option value="Non-Akademik">Non-Akademik</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Status</option>
              <option value="Menunggu">Menunggu Review</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
            </select>

            <select
              value={filterJenjang}
              onChange={(e) => setFilterJenjang(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Jenjang</option>
              <option value="Kota/Kab">Kota / Kab</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>
        )}

        {/* View Mode 1: STANDARD TABLE */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3.5">Nama Siswa / Email</th>
                  <th className="px-4 py-3.5">Kelas</th>
                  <th className="px-5 py-3.5">Nama Kejuaraan</th>
                  <th className="px-4 py-3.5">Jenjang</th>
                  <th className="px-4 py-3.5">Hasil</th>
                  <th className="px-4 py-3.5">Status Verifikasi</th>
                  <th className="px-4 py-3.5 text-center">Berkas</th>
                  <th className="px-5 py-3.5 text-center">Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400 font-medium">
                      Tidak ada data prestasi yang memenuhi kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Siswa & Email */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{item.namaSiswa}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.email}</div>
                        <div className="text-[10px] text-slate-400">WA: {item.noTelp}</div>
                      </td>

                      {/* Kelas */}
                      <td className="px-4 py-4 font-semibold text-slate-700 whitespace-nowrap">
                        {item.kelas}
                      </td>

                      {/* Kejuaraan */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-semibold text-slate-800 line-clamp-2">{item.namaKejuaraan}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Tgl Sertifikat: {item.tanggalSertifikat}
                        </div>
                      </td>

                      {/* Jenjang */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          item.jenjang === 'Internasional' ? 'bg-amber-100 text-amber-800' :
                          item.jenjang === 'Nasional' ? 'bg-blue-100 text-blue-800' :
                          item.jenjang === 'Provinsi' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {item.jenjang}
                        </span>
                      </td>

                      {/* Hasil */}
                      <td className="px-4 py-4 font-black text-indigo-700 whitespace-nowrap">
                        🏆 {item.hasil}
                      </td>

                      {/* Status Verifikasi */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {item.status === 'Disetujui' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Disetujui
                          </span>
                        )}
                        {item.status === 'Menunggu' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            Menunggu Review
                          </span>
                        )}
                        {item.status === 'Ditolak' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Ditolak
                          </span>
                        )}
                      </td>

                      {/* Berkas File */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setViewCertificateItem(item)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium text-[11px] inline-flex items-center gap-1"
                          title="Lihat Sertifikat"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Berkas</span>
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {item.status !== 'Disetujui' && (
                            <button
                              onClick={() => handleApprove(item)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-colors"
                              title="Setujui Data Ini"
                            >
                              Setujui
                            </button>
                          )}
                          {item.status !== 'Ditolak' && (
                            <button
                              onClick={() => setRejectModalItem(item)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-2xs transition-colors"
                              title="Tolak Data Ini"
                            >
                              Tolak
                            </button>
                          )}
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.namaSiswa)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View Mode 2: REALTIME SPREADSHEET (Spreadsheet Live Grid) */}
        {viewMode === 'spreadsheet' && (
          <div className="p-4 space-y-4 bg-slate-900 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/90 p-3.5 rounded-xl border border-slate-700 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="font-mono text-emerald-300 font-bold">
                  Grid Spreadsheet Interaktif (Klik sel mana saja untuk mengedit data)
                </span>
              </div>
              <div className="flex items-center gap-3">
                {spreadsheetSaveSuccess && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                    <Check className="w-4 h-4" /> Terpanen &amp; Tersimpan!
                  </span>
                )}
                <button
                  onClick={handleSaveSpreadsheet}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Spreadsheet</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[600px] border border-slate-700 rounded-xl">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead className="bg-slate-800 text-slate-300 border-b border-slate-700 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 border-r border-slate-700 text-center w-12">#</th>
                    <th className="px-3 py-2 border-r border-slate-700 min-w-[150px]">Nama Siswa</th>
                    <th className="px-3 py-2 border-r border-slate-700 min-w-[180px]">Email</th>
                    <th className="px-3 py-2 border-r border-slate-700 w-28">Kelas</th>
                    <th className="px-3 py-2 border-r border-slate-700 min-w-[220px]">Nama Kejuaraan</th>
                    <th className="px-3 py-2 border-r border-slate-700 w-32">Kategori</th>
                    <th className="px-3 py-2 border-r border-slate-700 w-32">Jenjang</th>
                    <th className="px-3 py-2 border-r border-slate-700 w-28">Hasil</th>
                    <th className="px-3 py-2 border-r border-slate-700 w-32">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/80">
                  {data.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-800/50">
                      <td className="px-3 py-2 border-r border-slate-800 text-center text-slate-500">{idx + 1}</td>

                      {/* Nama Siswa Cell */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <input
                          type="text"
                          value={row.namaSiswa}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'namaSiswa', e.target.value)}
                          className="w-full bg-transparent text-white px-2 py-1 rounded focus:bg-slate-800 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                        />
                      </td>

                      {/* Email Cell */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <input
                          type="text"
                          value={row.email}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'email', e.target.value)}
                          className="w-full bg-transparent text-slate-300 px-2 py-1 rounded focus:bg-slate-800 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                        />
                      </td>

                      {/* Kelas Cell */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <input
                          type="text"
                          value={row.kelas}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'kelas', e.target.value)}
                          className="w-full bg-transparent text-yellow-300 font-bold px-2 py-1 rounded focus:bg-slate-800 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                        />
                      </td>

                      {/* Nama Kejuaraan Cell */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <input
                          type="text"
                          value={row.namaKejuaraan}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'namaKejuaraan', e.target.value)}
                          className="w-full bg-transparent text-slate-200 px-2 py-1 rounded focus:bg-slate-800 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                        />
                      </td>

                      {/* Kategori Select */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <select
                          value={row.kategori}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'kategori', e.target.value)}
                          className="w-full bg-slate-900 text-indigo-300 px-1 py-1 rounded border border-slate-700"
                        >
                          <option value="Akademik">Akademik</option>
                          <option value="Non-Akademik">Non-Akademik</option>
                        </select>
                      </td>

                      {/* Jenjang Select */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <select
                          value={row.jenjang}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'jenjang', e.target.value)}
                          className="w-full bg-slate-900 text-emerald-300 px-1 py-1 rounded border border-slate-700"
                        >
                          <option value="Kota/Kab">Kota/Kab</option>
                          <option value="Provinsi">Provinsi</option>
                          <option value="Nasional">Nasional</option>
                          <option value="Internasional">Internasional</option>
                        </select>
                      </td>

                      {/* Hasil Input */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <input
                          type="text"
                          value={row.hasil}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'hasil', e.target.value)}
                          className="w-full bg-slate-900 text-amber-300 font-bold px-2 py-1 rounded border border-slate-700 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                        />
                      </td>

                      {/* Status Select */}
                      <td className="px-2 py-1 border-r border-slate-800">
                        <select
                          value={row.status}
                          onChange={(e) => handleSpreadsheetCellChange(row.id, 'status', e.target.value)}
                          className={`w-full font-bold px-1 py-1 rounded border border-slate-700 ${
                            row.status === 'Disetujui' ? 'bg-emerald-950 text-emerald-300' :
                            row.status === 'Ditolak' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Disetujui">Disetujui</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-400">
          <span>Sinkronisasi spreadsheet &amp; data lokal: Terhubung aktif</span>
          <span>HIMPRES SMADA by bidang kesiswaan - SMAN 2 KOTA PASURUAN</span>
        </div>
      </div>

      {/* Modal Rejection Reason */}
      {rejectModalItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Alasan Penolakan Verifikasi</span>
              </h3>
              <button onClick={() => setRejectModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Sampaikan alasan penolakan kepada <span className="font-bold text-slate-900">{rejectModalItem.namaSiswa}</span> agar dapat melengkapi kembali bukti sertifikahnya.
            </p>

            <textarea
              rows={3}
              placeholder="Contoh: File sertifikat buram, mohon unggah ulang versi scan PDF yang berstempel basah."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View Certificate */}
      {viewCertificateItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Berkas Sertifikat Siswa</h3>
                <p className="text-xs text-slate-500">{viewCertificateItem.namaSiswa} ({viewCertificateItem.kelas})</p>
              </div>
              <button onClick={() => setViewCertificateItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-indigo-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">{viewCertificateItem.sertifikat.namaFile}</div>
              {viewCertificateItem.sertifikat.dataBase64 ? (
                <div className="pt-2">
                  <a
                    href={viewCertificateItem.sertifikat.dataBase64}
                    download={viewCertificateItem.sertifikat.namaFile}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 inline-block shadow-md"
                  >
                    Unduh / Buka Dokumen Lengkap
                  </a>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Sertifikat tersimpan aman di server SIPP SMADA.</p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewCertificateItem(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Record */}
      {editItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSaveEditModal} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Edit Data Prestasi Siswa</h3>
              <button type="button" onClick={() => setEditItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Siswa</label>
                <input
                  type="text"
                  value={editItem.namaSiswa}
                  onChange={(e) => setEditItem({ ...editItem, namaSiswa: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={editItem.email}
                    onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelas</label>
                  <input
                    type="text"
                    value={editItem.kelas}
                    onChange={(e) => setEditItem({ ...editItem, kelas: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Kejuaraan</label>
                <input
                  type="text"
                  value={editItem.namaKejuaraan}
                  onChange={(e) => setEditItem({ ...editItem, namaKejuaraan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenjang</label>
                  <select
                    value={editItem.jenjang}
                    onChange={(e) => setEditItem({ ...editItem, jenjang: e.target.value as JenjangPrestasi })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Kota/Kab">Kota/Kab</option>
                    <option value="Provinsi">Provinsi</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hasil (Manual/Bebas)</label>
                  <input
                    type="text"
                    value={editItem.hasil}
                    onChange={(e) => setEditItem({ ...editItem, hasil: e.target.value })}
                    placeholder="e.g. Juara 1, Best Speaker, Harapan 1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Add Record Manually */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">Tambah Data Prestasi (Admin)</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pengisian data cepat oleh Admin Kesiswaan. Data langsung tersimpan berstatus Disetujui.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newRecord = addPrestasi({
                  kategori: (form.elements.namedItem('kategori') as HTMLSelectElement).value as KategoriPrestasi,
                  email: (form.elements.namedItem('email') as HTMLInputElement).value,
                  namaSiswa: (form.elements.namedItem('namaSiswa') as HTMLInputElement).value,
                  kelas: (form.elements.namedItem('kelas') as HTMLInputElement).value,
                  noTelp: (form.elements.namedItem('noTelp') as HTMLInputElement).value,
                  jenjang: (form.elements.namedItem('jenjang') as HTMLSelectElement).value as JenjangPrestasi,
                  hasil: (form.elements.namedItem('hasil') as HTMLSelectElement).value as HasilKejuaraan,
                  namaKejuaraan: (form.elements.namedItem('namaKejuaraan') as HTMLInputElement).value,
                  tanggalSertifikat: (form.elements.namedItem('tanggalSertifikat') as HTMLInputElement).value,
                  sertifikat: {
                    namaFile: 'Input_Manual_Kesiswaan.pdf',
                    tipeFile: 'application/pdf',
                    ukuranFile: 500000,
                  },
                });
                updatePrestasi(newRecord.id, { status: 'Disetujui', catatanVerifikasi: 'Diinput oleh Tim Kesiswaan SMADA' });
                setIsAddModalOpen(false);
                loadData();
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <input name="namaSiswa" required placeholder="Nama Siswa" className="p-2.5 bg-slate-50 border rounded-xl" />
                <input name="email" required placeholder="Email Siswa" className="p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input name="kelas" required placeholder="Kelas (e.g. XII MIPA 1)" className="p-2.5 bg-slate-50 border rounded-xl" />
                <input name="noTelp" required placeholder="No WA / Telp" className="p-2.5 bg-slate-50 border rounded-xl" />
              </div>
              <input name="namaKejuaraan" required placeholder="Nama Kejuaraan Lomba" className="w-full p-2.5 bg-slate-50 border rounded-xl" />

              <div className="grid grid-cols-3 gap-2">
                <select name="kategori" className="p-2.5 bg-slate-50 border rounded-xl">
                  <option value="Akademik">Akademik</option>
                  <option value="Non-Akademik">Non-Akademik</option>
                </select>
                <select name="jenjang" className="p-2.5 bg-slate-50 border rounded-xl">
                  <option value="Kota/Kab">Kota/Kab</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Internasional">Internasional</option>
                </select>
                <input name="hasil" required placeholder="Hasil (e.g. Juara 1, Best Speaker)" className="p-2.5 bg-slate-50 border rounded-xl font-medium" />
              </div>

              <input name="tanggalSertifikat" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2.5 bg-slate-50 border rounded-xl" />

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
