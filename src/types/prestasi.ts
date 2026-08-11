export type KategoriPrestasi = 'Akademik' | 'Non-Akademik';

export type JenjangPrestasi = 'Kota/Kab' | 'Provinsi' | 'Nasional' | 'Internasional';

export type HasilKejuaraan = string;

export type StatusVerifikasi = 'Menunggu' | 'Disetujui' | 'Ditolak';

export interface FileSertifikat {
  namaFile: string;
  tipeFile: string; // 'application/pdf' | 'image/jpeg' | 'image/png' etc
  ukuranFile: number; // in bytes
  dataBase64?: string; // base64 representation or data URL
}

export interface PrestasiSiswa {
  id: string;
  kategori: KategoriPrestasi;
  email: string;
  namaSiswa: string;
  kelas: string;
  noTelp: string;
  jenjang: JenjangPrestasi;
  hasil: HasilKejuaraan;
  namaKejuaraan: string;
  penyelenggara?: string;
  tanggalSertifikat: string; // YYYY-MM-DD
  sertifikat: FileSertifikat;
  status: StatusVerifikasi;
  catatanVerifikasi?: string;
  tanggalSubmit: string; // ISO string
  diupdatePada: string; // ISO string
}

export type ActiveTab = 'input' | 'status' | 'publik' | 'admin';
