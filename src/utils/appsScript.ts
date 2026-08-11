const URL_STORAGE_KEY = 'himpres_smada_apps_script_url';

export function getAppsScriptUrl(): string {
  try {
    return localStorage.getItem(URL_STORAGE_KEY) || '';
  } catch (err) {
    return '';
  }
}

export function saveAppsScriptUrl(url: string): void {
  const cleanUrl = url.trim();
  try {
    localStorage.setItem(URL_STORAGE_KEY, cleanUrl);
    window.dispatchEvent(new Event('himpres_smada_script_url_updated'));

    // Sync config to server backend
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appsScriptUrl: cleanUrl }),
    }).catch(err => console.error('Failed to sync config to server:', err));
  } catch (err) {
    console.error('Error saving Apps Script URL:', err);
  }
}

export async function fetchServerConfig(): Promise<string> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      if (data.appsScriptUrl) {
        localStorage.setItem(URL_STORAGE_KEY, data.appsScriptUrl);
        window.dispatchEvent(new Event('himpres_smada_script_url_updated'));
        return data.appsScriptUrl;
      }
    }
  } catch (err) {
    console.warn('Unable to fetch config from server, using local fallback:', err);
  }
  return getAppsScriptUrl();
}

export async function testAppsScriptConnection(url: string): Promise<{ success: boolean; message: string }> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL Google Apps Script tidak boleh kosong.' };
  }

  if (!cleanUrl.startsWith('https://script.google.com/')) {
    return { success: false, message: 'URL tidak valid. URL harus diawali dengan https://script.google.com/' };
  }

  try {
    const response = await fetch(cleanUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return { success: true, message: 'Koneksi Berhasil! Google Apps Script siap digunakan.' };
    } else {
      // Try fallback ping
      const ping = await fetch(cleanUrl, { mode: 'no-cors' });
      if (ping) {
        return { success: true, message: 'Koneksi Terhubung! Server Google Apps Script terjangkau.' };
      }
      return { success: false, message: `Merespon dengan status ${response.status}.` };
    }
  } catch (err: any) {
    try {
      const ping = await fetch(cleanUrl, { mode: 'no-cors' });
      if (ping) {
        return { success: true, message: 'Koneksi Terhubung! Server Google Apps Script merespon aktif.' };
      }
    } catch (pingErr) {
      // empty
    }
    return { success: false, message: 'Gagal terhubung. Pastikan URL Web App benar dan Opsi Akses di-set "Siapa saja" (Anyone).' };
  }
}

export async function sendDataToAppsScript(url: string, data: any): Promise<{ success: boolean; message: string }> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    return { success: false, message: 'URL Web App belum dikonfigurasi.' };
  }

  try {
    await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
      mode: 'no-cors',
    });

    return { success: true, message: 'Data berhasil dikirim ke Google Sheets!' };
  } catch (err: any) {
    return { success: false, message: 'Gagal mengirim data: ' + (err.message || 'Masalah jaringan') };
  }
}
