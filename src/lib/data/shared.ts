/**
 * Shared constants and utility functions for healthcare data.
 * Safe for both Client and Server components.
 */

// --- Doctors ---
export const specializationFilters = [
  { code: 'all', label: 'Semua Spesialis' },
  { code: 'jantung', label: 'Jantung & Pembuluh Darah' },
  { code: 'anak', label: 'Anak' },
  { code: 'kandungan', label: 'Kebidanan & Kandungan' },
  { code: 'bedah', label: 'Bedah Umum' },
  { code: 'penyakit-dalam', label: 'Penyakit Dalam' }
];

export function getInitials(name: string | null | undefined): string {
  if (!name) return '';
  const cleanName = name.replace(/dr\.\s/i, '').replace(/,\s*[a-zA-Z.]+/g, '').trim();
  const arr = cleanName.split(' ');
  const firstLetter = arr[0]?.[0] || '';
  const secondLetter = arr.length > 1 ? arr[1]?.[0] || '' : '';
  return (firstLetter + secondLetter).toUpperCase();
}

// --- News ---
export function formatDateId(dateObj: Date | string | number | null | undefined): string {
  if (!dateObj) return '';
  const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// --- Schedules ---
export const scheduleFilters = [
  { code: 'all', label: 'Semua Poli' },
  { code: 'jantung', label: 'Jantung' },
  { code: 'anak', label: 'Anak' },
  { code: 'kandungan', label: 'Kandungan' },
  { code: 'bedah', label: 'Bedah' }
];

export function getScheduleStatus(filled: number, total: number): { label: string; variant: 'danger' | 'warning' | 'success' } {
  if (filled >= total) return { label: 'Penuh', variant: 'danger' };
  if (total - filled <= 5) return { label: 'Sisa Sedikit', variant: 'warning' };
  return { label: 'Tersedia', variant: 'success' };
}
