import { PrestasiSiswa } from '../types/prestasi';

const STORAGE_KEY = 'himpres_smada_prestasi_data_v4';
const NOTIF_STORAGE_KEY = 'himpres_smada_notifications_v2';

// Seed sample data is empty as requested
const SEED_DATA: PrestasiSiswa[] = [];

export function getStoredPrestasi(): PrestasiSiswa[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading data from localStorage', err);
    return SEED_DATA;
  }
}

export function savePrestasiData(data: PrestasiSiswa[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Broadcast storage event for real-time updates across tabs/components
    window.dispatchEvent(new Event('sipp_smada_data_updated'));
  } catch (err) {
    console.error('Error saving data to localStorage', err);
  }
}

export function addPrestasi(newPrestasi: Omit<PrestasiSiswa, 'id' | 'tanggalSubmit' | 'diupdatePada' | 'status'>): PrestasiSiswa {
  const current = getStoredPrestasi();
  const nextNum = current.length + 1;
  const formattedId = `SMADA-2026-${String(nextNum).padStart(3, '0')}`;
  const now = new Date().toISOString();

  const record: PrestasiSiswa = {
    ...newPrestasi,
    id: formattedId,
    status: 'Menunggu',
    tanggalSubmit: now,
    diupdatePada: now,
  };

  const updated = [record, ...current];
  savePrestasiData(updated);
  return record;
}

export function updatePrestasi(id: string, updates: Partial<PrestasiSiswa>): PrestasiSiswa | null {
  const current = getStoredPrestasi();
  let updatedRecord: PrestasiSiswa | null = null;

  const next = current.map(item => {
    if (item.id === id) {
      updatedRecord = {
        ...item,
        ...updates,
        diupdatePada: new Date().toISOString(),
      };
      return updatedRecord;
    }
    return item;
  });

  savePrestasiData(next);
  return updatedRecord;
}

export function deletePrestasi(id: string): void {
  const current = getStoredPrestasi();
  const next = current.filter(item => item.id !== id);
  savePrestasiData(next);
}

// System notifications log
export interface SystemNotification {
  id: string;
  studentEmail: string;
  studentName: string;
  prestasiId: string;
  namaKejuaraan: string;
  oldStatus: string;
  newStatus: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function getNotifications(): SystemNotification[] {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function addNotification(notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>): void {
  const current = getNotifications();
  const newNotif: SystemNotification = {
    ...notif,
    id: 'NOTIF-' + Date.now(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify([newNotif, ...current]));
  window.dispatchEvent(new Event('sipp_smada_notif_updated'));
}
