import React, { useState, useEffect } from 'react';
import { PrestasiSiswa } from '../types/prestasi';
import { getStoredPrestasi } from '../utils/storage';
import { Trophy, Search, Award, GraduationCap, Globe, CheckCircle2 } from 'lucide-react';

export const DirektoriPublic: React.FC = () => {
  const [data, setData] = useState<PrestasiSiswa[]>([]);
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterJenjang, setFilterJenjang] = useState<string>('Semua');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    setData(getStoredPrestasi());
  }, []);

  // Filter approved achievements only
  const approvedData = data.filter((item) => item.status === 'Disetujui');

  const filtered = approvedData.filter((item) => {
    if (filterKategori !== 'Semua' && item.kategori !== filterKategori) return false;
    if (filterJenjang !== 'Semua' && item.jenjang !== filterJenjang) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.namaSiswa.toLowerCase().includes(q) ||
        item.namaKejuaraan.toLowerCase().includes(q) ||
        item.kelas.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalInternational = approvedData.filter((i) => i.jenjang === 'Internasional').length;
  const totalNational = approvedData.filter((i) => i.jenjang === 'Nasional').length;
  const totalProvincial = approvedData.filter((i) => i.jenjang === 'Provinsi').length;
  const totalCity = approvedData.filter((i) => i.jenjang === 'Kota/Kab').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Banner Transparansi SMADA */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-xs font-bold">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Galeri Prestasi Siswa SMAN 2 Kota Pasuruan
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">HIMPRES SMADA by bidang kesiswaan</h1>
          <p className="text-indigo-200 text-sm max-w-2xl">
            Merekam Jejak Karya dan Juara Siswa-Siswi SMAN 2 Kota Pasuruan dalam Berbagai Kompetisi Akademik &amp; Non-Akademik dari Tingkat Kota Hingga Internasional.
          </p>

          {/* Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Internasional</div>
              <div className="text-2xl font-black text-amber-300">{totalInternational} <span className="text-xs font-normal text-white">Juara</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Nasional</div>
              <div className="text-2xl font-black text-sky-300">{totalNational} <span className="text-xs font-normal text-white">Juara</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Provinsi</div>
              <div className="text-2xl font-black text-purple-300">{totalProvincial} <span className="text-xs font-normal text-white">Juara</span></div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
              <div className="text-[10px] text-indigo-300 font-bold uppercase">Kota / Kabupaten</div>
              <div className="text-2xl font-black text-emerald-300">{totalCity} <span className="text-xs font-normal text-white">Juara</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari nama siswa, kejuaraan, kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Kategori (Akademik & Non-Akademik)</option>
              <option value="Akademik">Akademik</option>
              <option value="Non-Akademik">Non-Akademik</option>
            </select>
          </div>

          <div>
            <select
              value={filterJenjang}
              onChange={(e) => setFilterJenjang(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Semua">Semua Jenjang Prestasi</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Kota/Kab">Kota / Kabupaten</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  item.kategori === 'Akademik' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {item.kategori === 'Akademik' ? <GraduationCap className="w-3 h-3 inline mr-1" /> : <Award className="w-3 h-3 inline mr-1" />}
                  {item.kategori}
                </span>

                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {item.namaKejuaraan}
                </h3>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {item.namaSiswa} <span className="text-slate-400 font-normal">({item.kelas})</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                item.jenjang === 'Internasional' ? 'bg-amber-100 text-amber-800' :
                item.jenjang === 'Nasional' ? 'bg-blue-100 text-blue-800' :
                item.jenjang === 'Provinsi' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
              }`}>
                {item.jenjang}
              </span>

              <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                🏆 {item.hasil}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
