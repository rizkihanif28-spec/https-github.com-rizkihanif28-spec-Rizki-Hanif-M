import * as XLSX from 'xlsx';
import { PrestasiSiswa } from '../types/prestasi';

export function exportToExcel(data: PrestasiSiswa[], filename: string = 'Rekapitulasi_Prestasi_SMAN_2_Kota_Pasuruan.xlsx'): void {
  // Map data to clean readable Indonesian table rows
  const formattedRows = data.map((item, index) => ({
    'No': index + 1,
    'ID Registrasi': item.id,
    'Nama Siswa': item.namaSiswa,
    'Email Siswa': item.email,
    'Kelas': item.kelas,
    'No. Telp / WA': item.noTelp,
    'Kategori': item.kategori,
    'Nama Kejuaraan / Lomba': item.namaKejuaraan,
    'Penyelenggara': item.penyelenggara || '-',
    'Jenjang Prestasi': item.jenjang,
    'Hasil Kejuaraan': item.hasil,
    'Tanggal Sertifikat': item.tanggalSertifikat,
    'Status Verifikasi': item.status,
    'Catatan Tim Kesiswaan': item.catatanVerifikasi || '-',
    'Tanggal Pengajuan': new Date(item.tanggalSubmit).toLocaleString('id-ID'),
    'Terakhir Diperbarui': new Date(item.diupdatePada).toLocaleString('id-ID')
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Set column widths for beautiful spreadsheet output
  const colWidths = [
    { wch: 5 },  // No
    { wch: 16 }, // ID Registrasi
    { wch: 24 }, // Nama Siswa
    { wch: 26 }, // Email
    { wch: 12 }, // Kelas
    { wch: 16 }, // No Telp
    { wch: 15 }, // Kategori
    { wch: 40 }, // Nama Kejuaraan
    { wch: 30 }, // Penyelenggara
    { wch: 16 }, // Jenjang
    { wch: 12 }, // Hasil
    { wch: 18 }, // Tgl Sertifikat
    { wch: 16 }, // Status
    { wch: 35 }, // Catatan
    { wch: 22 }, // Tgl Pengajuan
    { wch: 22 }  // Terakhir Diperbarui
  ];
  worksheet['!cols'] = colWidths;

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Prestasi SMADA');

  // Export file
  XLSX.writeFile(workbook, filename);
}
