import React, { useState, useEffect } from 'react';
import { KategoriPrestasi, JenjangPrestasi, HasilKejuaraan, FileSertifikat } from '../types/prestasi';
import { addPrestasi } from '../utils/storage';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Award,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Send,
  Calendar,
  Phone,
  Mail,
  User,
  School,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface FormInputSiswaProps {
  initialKategori?: KategoriPrestasi;
  onSuccessSubmit: (studentEmail: string) => void;
}

const KELAS_OPTIONS = [
  'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9', 'X10',
  'XI 1', 'XI 2', 'XI 3', 'XI 4', 'XI 5', 'XI 6', 'XI 7', 'XI 8', 'XI 9', 'XI 10',
  'XII 1', 'XII 2', 'XII 3', 'XII 4', 'XII 5', 'XII 6', 'XII 7', 'XII 8', 'XII 9', 'XII 10',
  'Lainnya'
];

export const FormInputSiswa: React.FC<FormInputSiswaProps> = ({
  initialKategori = 'Akademik',
  onSuccessSubmit,
}) => {
  const [kategori, setKategori] = useState<KategoriPrestasi>(initialKategori);
  const [email, setEmail] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState(KELAS_OPTIONS[0]);
  const [customKelas, setCustomKelas] = useState('');
  const [noTelp, setNoTelp] = useState('');
  const [jenjang, setJenjang] = useState<JenjangPrestasi>('Kota/Kab');
  const [hasil, setHasil] = useState<HasilKejuaraan>('Juara 1');
  const [namaKejuaraan, setNamaKejuaraan] = useState('');
  const [penyelenggara, setPenyelenggara] = useState('');
  const [tanggalSertifikat, setTanggalSertifikat] = useState(() => new Date().toISOString().split('T')[0]);

  // Sertifikat file state
  const [sertifikatFile, setSertifikatFile] = useState<FileSertifikat | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (initialKategori) {
      setKategori(initialKategori);
    }
  }, [initialKategori]);

  // Handle File Upload and Base64 conversion
  const handleFileChange = (file: File) => {
    setFileError('');
    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('Ukuran file maksimal 5MB.');
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Format file harus berupa PDF, JPG, PNG, atau WEBP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSertifikatFile({
        namaFile: file.name,
        tipeFile: file.type,
        ukuranFile: file.size,
        dataBase64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !namaSiswa || !noTelp || !namaKejuaraan || !tanggalSertifikat) {
      alert('Mohon lengkapi semua bidang yang wajib diisi.');
      return;
    }

    if (!sertifikatFile) {
      setFileError('Bukti sertifikat (PDF atau Gambar) wajib diunggah.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const finalKelas = kelas === 'Lainnya' && customKelas ? customKelas : kelas;

      addPrestasi({
        kategori,
        email: email.trim(),
        namaSiswa: namaSiswa.trim(),
        kelas: finalKelas,
        noTelp: noTelp.trim(),
        jenjang,
        hasil,
        namaKejuaraan: namaKejuaraan.trim(),
        penyelenggara: penyelenggara.trim() || undefined,
        tanggalSertifikat,
        sertifikat: sertifikatFile,
      });

      setIsSubmitting(false);
      setFormSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  if (formSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-2xl border border-slate-200 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Prestasi Berhasil Didaftarkan!</h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Data prestasi siswa SMAN 2 Kota Pasuruan untuk <span className="font-semibold text-slate-900">{namaSiswa}</span> telah terkirim ke Tim Kesiswaan untuk proses verifikasi.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs text-slate-700 space-y-2 max-w-md mx-auto">
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Kategori:</span>
            <span className="font-bold text-indigo-700">{kategori}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Nama Kejuaraan:</span>
            <span className="font-semibold text-slate-900">{namaKejuaraan}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-500">Jenjang / Hasil:</span>
            <span className="font-semibold text-slate-900">{jenjang} • {hasil}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email Rujukan:</span>
            <span className="font-mono text-slate-800">{email}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setFormSuccess(false);
              setNamaKejuaraan('');
              setPenyelenggara('');
              setSertifikatFile(null);
            }}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium text-xs transition-colors"
          >
            Input Prestasi Lainnya
          </button>
          <button
            onClick={() => onSuccessSubmit(email)}
            className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Cek Status Verifikasi Realtime</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner SMAN 2 Kota Pasuruan */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-indigo-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 text-yellow-300 text-xs font-semibold mb-2 border border-indigo-700/60">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              HIMPRES SMADA by bidang kesiswaan
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Formulir Pendataan Prestasi Siswa</h1>
            <p className="text-indigo-200 text-xs mt-1 max-w-xl">
              Silakan isi data prestasi akademik maupun non-akademik yang telah diraih. Tim Kesiswaan SMADA akan melakukan verifikasi data secara real-time.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
        {/* Step 1: Kategori Selection */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">1</span>
            Pilih Kategori Prestasi <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setKategori('Akademik')}
              className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 relative ${
                kategori === 'Akademik'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/30 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-3 rounded-xl ${kategori === 'Akademik' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base">Prestasi Akademik</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Olimpiade Sains (OSN), Lomba Karya Tulis (LKTI), Debat, Cerdas Cermat, Riset Teknologi.
                </div>
              </div>
              {kategori === 'Akademik' && (
                <CheckCircle2 className="w-5 h-5 text-indigo-600 absolute top-4 right-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setKategori('Non-Akademik')}
              className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 relative ${
                kategori === 'Non-Akademik'
                  ? 'border-indigo-600 bg-amber-50/60 ring-2 ring-indigo-500/30 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`p-3 rounded-xl ${kategori === 'Non-Akademik' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base">Prestasi Non-Akademik</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Olahraga (O2SN), Seni & Tari (FLS2N), Musik, Pramuka, Paskibra, Keagamaan, Robotik.
                </div>
              </div>
              {kategori === 'Non-Akademik' && (
                <CheckCircle2 className="w-5 h-5 text-indigo-600 absolute top-4 right-4" />
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Data Diri Siswa */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">2</span>
            Identitas Siswa SMAN 2 Kota Pasuruan
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Siswa */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="contoh: nama.siswa@smada.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>

            {/* Nama Siswa */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Nama Lengkap Siswa <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Nama lengkap sesuai raport"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>

            {/* Kelas */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-slate-400" />
                Kelas <span className="text-rose-500">*</span>
              </label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 bg-slate-50/50"
              >
                {KELAS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {kelas === 'Lainnya' && (
                <input
                  type="text"
                  placeholder="Ketikkan nama kelas lainnya (misal: X 11, Merdeka 1, dll)"
                  value={customKelas}
                  onChange={(e) => setCustomKelas(e.target.value)}
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 bg-amber-50/50"
                />
              )}
            </div>

            {/* No Telp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                No. Telp / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0812xxxxxxxx"
                value={noTelp}
                onChange={(e) => setNoTelp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Detail Kejuaraan */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">3</span>
            Detail Kejuaraan & Prestasi
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Jenjang Prestasi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Jenjang Prestasi <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Kota/Kab', 'Provinsi', 'Nasional', 'Internasional'] as JenjangPrestasi[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setJenjang(level)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      jenjang === level
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Hasil Kejuaraan */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Hasil Kejuaraan / Juara <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">Isi Manual / Bebas</span>
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Ketik manual (misal: Juara 1, Harapan 1, Best Speaker, Medali Emas)"
                  value={hasil}
                  onChange={(e) => setHasil(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 bg-slate-50/50"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['Juara 1', 'Juara 2', 'Juara 3', 'Juara Harapan 1', 'Juara Harapan 2', 'Best Speaker', 'Gold Medal'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setHasil(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                        hasil === preset
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      🏆 {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nama Kejuaraan */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-slate-400" />
                Nama Kejuaraan / Lomba <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Olimpiade Sains Nasional Bidang Matematika 2026"
                value={namaKejuaraan}
                onChange={(e) => setNamaKejuaraan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>

            {/* Penyelenggara */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Penyelenggara Lomba (Opsional)</label>
              <input
                type="text"
                placeholder="Pusat Prestasi Nasional, Dispora Jatim, dll"
                value={penyelenggara}
                onChange={(e) => setPenyelenggara(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>

            {/* Tanggal Sertifikat */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Tanggal Sertifikat / SK <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalSertifikat}
                onChange={(e) => setTanggalSertifikat(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-800 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Upload Sertifikat */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">4</span>
            Upload Bukti Sertifikat (PDF atau Gambar) <span className="text-rose-500">*</span>
          </label>

          {!sertifikatFile ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80 bg-slate-50/40'
              }`}
            >
              <input
                type="file"
                id="sertifikat-input"
                accept=".pdf,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="sertifikat-input" className="cursor-pointer space-y-3 block">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Tarik & lepaskan berkas di sini, atau <span className="text-indigo-600 underline">Cari File</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Format didukung: PDF, JPG, PNG, WEBP (Maksimal 5MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold">
                  {sertifikatFile.tipeFile === 'application/pdf' ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <FileCheck className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{sertifikatFile.namaFile}</p>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {(sertifikatFile.ukuranFile / 1024).toFixed(1)} KB • Terunggah siap diverifikasi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSertifikatFile(null)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                title="Hapus file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {fileError && (
            <div className="flex items-center gap-2 text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fileError}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 italic">
            * Data yang anda kirimkan tersimpan secara otomatis dan dapat dipantau real-time.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Mengirimkan Data...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirimkan Pendataan Prestasi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
