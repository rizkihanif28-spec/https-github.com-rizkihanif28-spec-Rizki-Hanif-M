/**
 * ============================================================================
 * HIMPRES SMADA by Bidang Kesiswaan - Google Apps Script (Code.gs)
 * SMAN 2 KOTA PASURUAN
 * ============================================================================
 * 
 * PETUNJUK PENGGUNAAN:
 * 1. Buka Google Sheets di Google Drive Anda (misal beri nama: "Database HIMPRES SMADA").
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus semua kode bawaan, lalu salin (paste) SELURUH kode di bawah ini ke file Code.gs.
 * 4. Klik ikon Simpan (💾 / Save).
 * 5. Pilih fungsi 'setupSheetHeader' pada menu atas, lalu klik "Jalankan" (Run) 
 *    untuk membuat judul kolom secara otomatis di Google Sheet Anda.
 * 6. Klik tombol "Terapkan" (Deploy) > "Terapkan sebagai Aplikasi Web" (New Deployment).
 * 7. Pada bagian "Siapa yang memiliki akses" (Who has access), pilih "Siapa saja" (Anyone).
 * 8. Klik "Terapkan" (Deploy) dan izinkan akses (Grant Access).
 * 9. Salin URL Web App yang dihasilkan. URL ini siap digunakan untuk sync data prestasi.
 * ============================================================================
 */

// Nama Sheet tempat menyimpan data
var SHEET_NAME = "Data_Prestasi";

/**
 * Membuat Header Kolom Otomatis di Google Sheet
 */
function setupSheetHeader() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  var headers = [
    "ID Prestasi",
    "Tanggal Submit",
    "Kategori",
    "Nama Siswa",
    "Kelas",
    "Email",
    "No. Telepon / WA",
    "Nama Kejuaraan",
    "Penyelenggara",
    "Jenjang",
    "Hasil Kejuaraan",
    "Tanggal Sertifikat",
    "Status Verifikasi",
    "Catatan Verifikasi",
    "Nama File Sertifikat"
  ];
  
  // Format Header
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#1e1b4b"); // Indigo 950
  headerRange.setFontColor("#ffffff");
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  
  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  
  Logger.log("Header berhasil dibuat di Sheet: " + SHEET_NAME);
}

/**
 * Menangani request POST (Menerima input data prestasi baru dari Web HIMPRES SMADA)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      setupSheetHeader();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Jika data berupa array (multiple items)
    var items = Array.isArray(data) ? data : [data];
    
    items.forEach(function(item) {
      sheet.appendRow([
        item.id || "SMADA-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 1000),
        item.tanggalSubmit || new Date().toISOString(),
        item.kategori || "-",
        item.namaSiswa || "-",
        item.kelas || "-",
        item.email || "-",
        item.noTelp || "-",
        item.namaKejuaraan || "-",
        item.penyelenggara || "-",
        item.jenjang || "-",
        item.hasil || "-",
        item.tanggalSertifikat || "-",
        item.status || "Menunggu",
        item.catatanVerifikasi || "",
        item.sertifikat ? item.sertifikat.namaFile : (item.namaFileSertifikat || "-")
      ]);
    });
    
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Data berhasil disimpan ke Google Sheets HIMPRES SMADA",
        count: items.length
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Menangani request GET (Mengambil/Membaca data dari Google Sheets dalam format JSON)
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var result = [];
    var headers = rows[0];
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var obj = {
        id: row[0],
        tanggalSubmit: row[1],
        kategori: row[2],
        namaSiswa: row[3],
        kelas: row[4],
        email: row[5],
        noTelp: row[6],
        namaKejuaraan: row[7],
        penyelenggara: row[8],
        jenjang: row[9],
        hasil: row[10],
        tanggalSertifikat: row[11],
        status: row[12],
        catatanVerifikasi: row[13],
        namaFileSertifikat: row[14]
      };
      result.push(obj);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
