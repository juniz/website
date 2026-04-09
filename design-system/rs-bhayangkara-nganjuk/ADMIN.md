# UI Prompt — Admin Panel RS Bhayangkara
> **Stack:** Next.js 14 App Router · Supabase · Tailwind CSS · TypeScript  
> **Warna Utama:** Blue Azure (`#1E6FBF` primary · `#E6F1FB` surface · `#0C447C` dark)  
> **Database:** Supabase (PostgreSQL) dengan tabel: `doctors`, `schedules`, `registrations`, `news`

---

## Daftar Isi

1. [Root Layout & Sidebar](#1-root-layout--sidebar)
2. [Halaman Login](#2-halaman-login)
3. [Dashboard](#3-dashboard)
4. [Modul Dokter — Daftar](#4-modul-dokter--daftar)
5. [Modul Dokter — Form Tambah/Edit](#5-modul-dokter--form-tambah--edit)
6. [Modul Jadwal — Daftar](#6-modul-jadwal--daftar)
7. [Modul Jadwal — Form Tambah/Edit](#7-modul-jadwal--form-tambah--edit)
8. [Modul Registrasi — Daftar](#8-modul-registrasi--daftar)
9. [Modul Registrasi — Update Status](#9-modul-registrasi--update-status)
10. [Modul Berita — Daftar](#10-modul-berita--daftar)
11. [Modul Berita — Form Tulis/Edit](#11-modul-berita--form-tulis--edit)
12. [Komponen Shared & API Routes](#12-komponen-shared--api-routes)

---

## Struktur Database (Referensi)

```sql
-- doctors: id, name, specialization, image, is_available, created_at, updated_at
-- schedules: id, time, date, total_quota, filled_quota, doctor_id (FK), created_at, updated_at
-- registrations: id, patient_name, dob, phone, insurance, bpjs_number, complaint,
--                status (Pending/Confirmed/Done/Cancelled), schedule_id (FK), created_at, updated_at
-- news: id, title, slug, excerpt, content, category, image, date, author, read_time, created_at, updated_at
```

---

## 1. Root Layout & Sidebar

**File:** `/app/admin/layout.tsx`

Buat root layout admin dengan sidebar navigasi fixed di kiri (lebar 240px) dan area konten utama di kanan menggunakan CSS Grid (`grid-template-columns: 240px 1fr`).

**Sidebar — struktur:**
- Bagian atas: logo/ikon hospital + nama "RS Bhayangkara" (font bold, teks biru gelap)
- Menu navigasi vertikal dengan ikon + label:
  - Dashboard (`/admin`)
  - Dokter (`/admin/doctors`)
  - Jadwal (`/admin/schedules`)
  - Registrasi (`/admin/registrations`)
  - Berita (`/admin/news`)
- Active state: `bg-blue-100 text-blue-800 font-medium rounded-lg`
- Hover state: `bg-blue-50`
- Bagian bawah: avatar inisial + nama admin yang login + tombol Logout

**Sidebar — warna:**
- Background: `white` dengan `border-right: 1px solid #E5E7EB`
- Item aktif: background `#DBEAFE`, teks `#1E40AF`
- Item hover: background `#EFF6FF`

**Area konten utama:**
- Header sticky di atas: breadcrumb navigasi (kiri) + slot tombol CTA (kanan)
- Padding konten: `p-8`
- Background area: `#F8FAFC`

**Auth Guard:**  
Gunakan `middleware.ts` di root project untuk redirect ke `/admin/login` jika tidak ada Supabase session aktif.

```typescript
// middleware.ts — contoh
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return res
}
```

---

## 2. Halaman Login

**File:** `/app/admin/login/page.tsx`

Halaman login fullscreen dengan layout split horizontal (hidden sisi kiri di mobile).

**Sisi kiri (hidden di mobile, `lg:block`):**
- Background solid biru azure: `#1E6FBF`
- Logo + nama rumah sakit ukuran besar, warna putih
- Tagline: "Sistem Informasi Manajemen RS Bhayangkara"
- Ilustrasi SVG sederhana bertema medis/hospital (cross, stethoscope, atau building)

**Sisi kanan — form login:**
- Card putih `max-width: 380px` posisi center vertikal
- Heading: "Masuk ke Panel Admin" (`font-size: 22px, font-weight: 600`)
- Subheading: "Khusus untuk staf yang berwenang"
- Input Email (`type="email"`, label "Email", required)
- Input Password (`type="password"`, label "Kata Sandi") + tombol toggle show/hide ikon mata
- Tombol "Masuk" biru full-width (`bg-blue-600 hover:bg-blue-700`)
- Loading spinner di dalam tombol saat submit
- Pesan error inline di bawah form jika login gagal (teks merah, tidak reload halaman)

**Logic Auth:**
```typescript
const { error } = await supabase.auth.signInWithPassword({ email, password })
if (error) setErrorMsg(error.message)
else router.push('/admin')
```

---

## 3. Dashboard

**File:** `/app/admin/page.tsx` (Server Component + Supabase SSR)

**Baris 1 — 4 Metric Card** (grid 4 kolom, collapse ke 2 kolom di tablet):

| Card | Query Supabase | Warna Border-top |
|---|---|---|
| Total Dokter Aktif | `SELECT COUNT(*) FROM doctors WHERE is_available = true` | Biru (`#1E6FBF`) |
| Jadwal Hari Ini | `SELECT COUNT(*) FROM schedules WHERE date = CURRENT_DATE` | Teal (`#0F9488`) |
| Registrasi Pending | `SELECT COUNT(*) FROM registrations WHERE status = 'Pending'` | Amber (`#D97706`) |
| Total Berita | `SELECT COUNT(*) FROM news` | Purple (`#7C3AED`) |

Setiap card: ikon berwarna (24px), angka besar (`font-size: 32px, font-weight: 700`), label kecil di bawah (`font-size: 13px, color: gray`), border-top 4px berwarna.

**Baris 2 — 2 Kolom:**

Kolom kiri — **Registrasi Terbaru** (tabel 5 baris):
```sql
SELECT r.patient_name, r.status, r.created_at,
       d.name as doctor_name, s.date, s.time
FROM registrations r
JOIN schedules s ON r.schedule_id = s.id
JOIN doctors d ON s.doctor_id = d.id
ORDER BY r.created_at DESC
LIMIT 5
```
Kolom tabel: Nama Pasien · Dokter · Tanggal Jadwal · Status Badge · Waktu dibuat

Kolom kanan — **Jadwal Mendatang** (3 hari ke depan, list card):
```sql
SELECT s.date, s.time, s.filled_quota, s.total_quota,
       d.name as doctor_name, d.specialization
FROM schedules s
JOIN doctors d ON s.doctor_id = d.id
WHERE s.date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
ORDER BY s.date ASC, s.time ASC
```

**Status Badge warna:**
- `Pending` → background amber-100, teks amber-800
- `Confirmed` → background blue-100, teks blue-800
- `Done` → background green-100, teks green-800
- `Cancelled` → background red-100, teks red-800

---

## 4. Modul Dokter — Daftar

**File:** `/app/admin/doctors/page.tsx`

**Header halaman:**
- Heading "Manajemen Dokter" (kiri)
- Tombol "+ Tambah Dokter" link ke `/admin/doctors/new` (kanan, biru solid)

**Toolbar filter (di bawah header):**
- Input search (`placeholder="Cari nama atau spesialisasi..."`) — filter client-side
- Dropdown filter status: `Semua | Tersedia | Tidak Tersedia`

**Grid card** (3 kolom desktop → 2 tablet → 1 mobile):

Setiap card dokter:
- Avatar foto (`<img src={image} />`) — fallback ke lingkaran inisial nama, background biru-100, teks biru-800
- Nama dokter (`font-weight: 500, font-size: 16px`)
- Badge spesialisasi (`bg-blue-50, text-blue-700, rounded-full, px-3 py-1, font-size: 12px`)
- Toggle switch `is_available` — label "Tersedia" / "Tidak Tersedia"
- Baris tombol aksi: `Edit` (outline biru) + `Hapus` (outline merah)

**Toggle `is_available`:**  
Klik toggle → optimistic update UI → `PATCH /api/doctors/[id]` dengan `{ is_available: !current }`

**Hapus dokter:**  
Klik Hapus → tampilkan `<ConfirmDialog>` dengan pesan:  
*"Hapus dr. [nama]? Semua jadwal yang terkait dengan dokter ini akan ikut terhapus."*  
Konfirmasi → `DELETE /api/doctors/[id]` → refresh grid → toast sukses.

**Query utama:**
```sql
SELECT * FROM doctors ORDER BY created_at DESC
```

---

## 5. Modul Dokter — Form Tambah / Edit

**File:**  
- `/app/admin/doctors/new/page.tsx`  
- `/app/admin/doctors/[id]/edit/page.tsx`

Layout card terpusat (`max-width: 600px, margin: auto`).

**Field-field form:**

| Field | Tipe | Validasi |
|---|---|---|
| Nama Lengkap | `text` | Required, min 3 karakter, placeholder `dr. Nama Spesialis` |
| Spesialisasi | `text` | Required, contoh: "Kardiologi", "Penyakit Dalam" |
| URL Foto | `text` (URL) | Optional — tampilkan preview `<img>` realtime jika URL valid |
| Status Tersedia | `toggle switch` | Default: `true` |

**Validasi:** React Hook Form + Zod schema.

```typescript
const doctorSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  specialization: z.string().min(2, 'Spesialisasi wajib diisi'),
  image: z.string().url().optional().or(z.literal('')),
  is_available: z.boolean().default(true),
})
```

**Actions:**
- Tambah baru: `POST /api/doctors`
- Edit: `PATCH /api/doctors/[id]` (pre-fill form dari query `SELECT * FROM doctors WHERE id = $id`)
- Setelah sukses: `router.push('/admin/doctors')` + toast "Dokter berhasil disimpan"

**Tombol:**
- "Simpan Dokter" — biru solid, full-width, disabled + spinner saat loading
- "Batal" — link teks abu-abu kembali ke `/admin/doctors`

---

## 6. Modul Jadwal — Daftar

**File:** `/app/admin/schedules/page.tsx`

**Filter bar:**
- Date picker (default: hari ini) — saat berubah, refetch data
- Dropdown filter dokter: `SELECT id, name FROM doctors ORDER BY name`
- Tombol "+ Tambah Jadwal" (kanan atas)

**Tabel kolom:**

| Kolom | Keterangan |
|---|---|
| Tanggal | Format: `Senin, 8 April 2026` |
| Jam Praktek | Field `time` |
| Dokter | JOIN `doctors.name` |
| Spesialisasi | `doctors.specialization` |
| Kuota | Progress bar mini + teks `X / Y terisi` |
| Aksi | Tombol Edit + Hapus |

**Query utama:**
```sql
SELECT s.*, d.name AS doctor_name, d.specialization
FROM schedules s
JOIN doctors d ON s.doctor_id = d.id
WHERE s.date = $selectedDate
ORDER BY s.time ASC
```
Tambahkan `AND s.doctor_id = $doctorId` jika filter dokter dipilih.

**Highlight baris:**  
Baris dengan `filled_quota = total_quota` → background `#FEF2F2` (merah muda), badge "Penuh" merah.

**Progress bar kuota:**
```html
<div class="progress-bar">
  <div style="width: (filled/total * 100)%" class="bar-fill"></div>
</div>
<!-- Warna fill: hijau jika < 80%, amber jika 80-99%, merah jika 100% -->
```

---

## 7. Modul Jadwal — Form Tambah / Edit

**File:** `/app/admin/schedules/new/page.tsx`

Layout card terpusat (`max-width: 560px`).

**Field-field form:**

| Field | Tipe | Detail |
|---|---|---|
| Dokter | `select` | Query: `SELECT id, name FROM doctors WHERE is_available = true ORDER BY name` |
| Tanggal Praktek | `date` | `min` = hari ini (tidak bisa pilih masa lalu) |
| Jam Praktek | `select` atau `time` | Preset opsi: `07:00, 08:00, 09:00, 10:00, 13:00, 14:00, 15:00, 16:00` |
| Total Kuota | `number` | Default `20`, min `1`, max `100` |

**Validasi duplikat:**  
Sebelum submit, cek server-side:
```sql
SELECT id FROM schedules
WHERE doctor_id = $doctorId AND date = $date AND time = $time
```
Jika ada hasil → tampilkan error inline: *"Jadwal untuk dokter ini pada tanggal dan jam tersebut sudah ada."*

**Actions:**
- Tambah: `POST /api/schedules`
- Edit: `PATCH /api/schedules/[id]`
- Setelah sukses: redirect ke `/admin/schedules?date=$date`

---

## 8. Modul Registrasi — Daftar

**File:** `/app/admin/registrations/page.tsx`

**Filter bar:**
- Search input (nama pasien / nomor BPJS)
- Dropdown status: `Semua | Pending | Confirmed | Done | Cancelled`
- Date range: "Dari" + "Sampai" (filter berdasarkan `schedules.date`)
- Tombol "Export CSV" (kanan) — generate dan download file CSV dari data yang sedang ditampilkan

**Tabel kolom:**

| Kolom | Keterangan |
|---|---|
| No. | Nomor urut |
| Nama Pasien | `patient_name` |
| Usia | Hitung dari `dob`: `(today - dob) / 365` → tampil `"45 thn"` |
| Dokter & Jadwal | `doctor_name` + tanggal & jam jadwal |
| Asuransi | Badge: BPJS = hijau, Umum = biru |
| Status | Badge berwarna sesuai status |
| Aksi | Ikon: Lihat Detail · Ubah Status · Hapus |

**Query utama:**
```sql
SELECT r.*, s.date AS schedule_date, s.time AS schedule_time,
       d.name AS doctor_name
FROM registrations r
JOIN schedules s ON r.schedule_id = s.id
JOIN doctors d ON s.doctor_id = d.id
ORDER BY r.created_at DESC
```
Tambahkan `WHERE` clause dinamis sesuai filter yang aktif.

**Slide-over Detail Panel:**  
Klik ikon "Lihat Detail" → panel slide dari kanan (width 420px) dengan overlay gelap. Tampilkan:
- Nama pasien (heading besar)
- Semua field registrasi: tanggal lahir, no. telepon, asuransi, nomor BPJS (jika ada)
- Keluhan (`complaint`)
- Informasi jadwal: dokter, spesialisasi, tanggal & jam
- Status saat ini + tombol "Ubah Status"
- Timestamp: didaftarkan pada (created_at)

---

## 9. Modul Registrasi — Update Status

**Component:** `StatusUpdateModal.tsx`

Modal kecil (`max-width: 400px`) yang muncul di atas overlay gelap.

**Konten modal:**
- Nama pasien sebagai heading
- Status saat ini ditampilkan sebagai badge
- Radio button / segmented control untuk pilihan status baru
- Textarea "Catatan" (opsional, tampil hanya jika status dipilih = `Cancelled`)
- Tombol "Simpan" (biru) + "Batal"

**Alur transisi status yang diperbolehkan:**

```
Pending    → Confirmed, Cancelled
Confirmed  → Done, Cancelled
Done       → (tidak bisa diubah — readonly)
Cancelled  → (tidak bisa diubah — readonly)
```

Tampilkan opsi yang tidak valid sebagai disabled dengan tooltip *"Status tidak dapat diubah kembali."*

**Action:**
```typescript
// PATCH /api/registrations/[id]
{ status: 'Confirmed', catatan: '' }
```
Setelah sukses: tutup modal + refresh tabel + toast "Status registrasi diperbarui".

---

## 10. Modul Berita — Daftar

**File:** `/app/admin/news/page.tsx`

**Header:**
- Heading "Manajemen Berita"
- Tombol "+ Tulis Berita" link ke `/admin/news/new`

**Filter bar:**
- Search input (judul berita)
- Dropdown kategori — query: `SELECT DISTINCT category FROM news ORDER BY category`

**Tabel kolom:**

| Kolom | Keterangan |
|---|---|
| Thumbnail | `<img>` 48×48px object-cover rounded, fallback placeholder biru-100 dengan ikon gambar |
| Judul & Excerpt | Judul bold, excerpt 2 baris truncate (`line-clamp-2`) |
| Kategori | Badge abu-abu / biru sesuai nilai |
| Penulis | `author` |
| Tanggal | Format relatif: *"2 hari lalu"*, *"5 jam lalu"* |
| Baca | `read_time` field |
| Aksi | Edit · Preview · Hapus |

**Query utama:**
```sql
SELECT id, title, slug, excerpt, category, image, date, author, read_time
FROM news
ORDER BY date DESC
```

**Aksi Preview:**  
Buka `/berita/[slug]` di tab baru (`window.open(url, '_blank')`).

**Hapus berita:**  
ConfirmDialog → `DELETE /api/news/[id]` → refresh tabel → toast sukses.

---

## 11. Modul Berita — Form Tulis / Edit

**File:**  
- `/app/admin/news/new/page.tsx`  
- `/app/admin/news/[id]/edit/page.tsx`

Layout 2 kolom: editor (`flex: 2`) + sidebar metadata (`flex: 1`). Collapse ke 1 kolom di mobile.

### Kolom Kiri — Editor Konten

- Input judul besar tanpa border (`font-size: 28px, font-weight: 600`, `placeholder="Judul berita..."`)
- Divider tipis
- **Rich Text Editor** menggunakan [Tiptap](https://tiptap.dev/) atau React Quill untuk field `content`

Toolbar editor:
`Bold | Italic | Heading 2 | Heading 3 | Bullet List | Ordered List | Blockquote | Link | Divider | Undo | Redo`

### Kolom Kanan — Sidebar Metadata

| Field | Tipe | Keterangan |
|---|---|---|
| Kategori | `text` + `<datalist>` | Suggestions dari kategori existing |
| Slug | `text` | Auto-generate dari judul (lowercase, replace spasi → `-`), bisa di-edit manual |
| Excerpt | `textarea` (3 baris) | Ringkasan singkat untuk preview |
| URL Gambar Cover | `text` | Input URL + thumbnail preview kecil di bawahnya |
| Penulis | `text` | Default `"Tim RS Bhayangkara"` |
| Estimasi Baca | `text` (readonly) | Auto-hitung: `Math.ceil(wordCount / 200) + " menit baca"` |
| Tanggal Tayang | `datetime-local` | Default: sekarang |

**Auto-generate slug:**
```typescript
const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim()
```

**Auto-save draft:**  
Setiap 30 detik → simpan `{ title, content, ...meta }` ke `localStorage` dengan key `news-draft-[id]`.  
Saat halaman dibuka → cek apakah ada draft tersimpan → tampilkan banner *"Ditemukan draft tersimpan dari [waktu]. Pulihkan?"*

**Tombol aksi:**
- "Simpan Draft" — outline biru, menyimpan tanpa publish
- "Terbitkan" — solid biru, `POST` atau `PATCH` ke API lalu redirect ke `/admin/news`

---

## 12. Komponen Shared & API Routes

### Komponen Reusable (`/components/admin/`)

#### `<DataTable>`
Tabel generik dengan props:
- `columns: { key, label, render? }[]`
- `data: any[]`
- `isLoading: boolean` (tampilkan skeleton rows saat true)
- `pagination: { page, perPage, total, onChange }` — opsi 10 / 25 / 50 per halaman
- `onSort: (key, direction) => void`

#### `<StatusBadge status />`
Badge dengan warna otomatis:
```typescript
const colors = {
  Pending:   'bg-amber-100 text-amber-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Done:      'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}
```

#### `<ConfirmDialog>`
Props: `isOpen, title, message, onConfirm, onCancel, confirmLabel?, confirmVariant?`  
Muncul di tengah layar dengan overlay. Tombol konfirmasi default merah (hapus), bisa di-override.

#### `<Toast>`
- Stack notifikasi di pojok kanan bawah
- Tipe: `success | error | warning | info`
- Auto-dismiss setelah 3 detik, bisa dismiss manual dengan klik ×
- Gunakan Zustand store atau React Context untuk trigger dari mana saja

#### `<PageHeader title action />`
Props: `title: string, breadcrumbs: { label, href }[], action?: ReactNode`  
Render heading + breadcrumb kiri + slot CTA kanan.

---

### API Routes (`/app/api/`)

Semua route menggunakan `createRouteHandlerClient` dari `@supabase/auth-helpers-nextjs`.  
Setiap route: cek session aktif → return `401` jika tidak authenticated.

```typescript
// Pattern dasar setiap route
const supabase = createRouteHandlerClient({ cookies })
const { data: { session } } = await supabase.auth.getSession()
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
```

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/doctors` | Ambil semua dokter, support `?available=true` |
| POST | `/api/doctors` | Tambah dokter baru |
| PATCH | `/api/doctors/[id]` | Update data dokter |
| DELETE | `/api/doctors/[id]` | Hapus dokter (cascade ke schedules via FK) |
| GET | `/api/schedules` | Ambil jadwal, support `?date=&doctor_id=` |
| POST | `/api/schedules` | Tambah jadwal + cek duplikat |
| PATCH | `/api/schedules/[id]` | Update jadwal |
| DELETE | `/api/schedules/[id]` | Hapus jadwal (restricted jika ada registrasi) |
| GET | `/api/registrations` | Ambil registrasi, support multi-filter |
| PATCH | `/api/registrations/[id]` | Update status + catatan |
| DELETE | `/api/registrations/[id]` | Hapus registrasi |
| GET | `/api/news` | Ambil berita, support `?category=&search=` |
| POST | `/api/news` | Tambah berita, validasi slug unik |
| PATCH | `/api/news/[id]` | Update berita |
| DELETE | `/api/news/[id]` | Hapus berita |

**Error response standard:**
```typescript
// 400 Bad Request
return NextResponse.json({ error: 'Deskripsi error' }, { status: 400 })

// 404 Not Found
return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })

// 409 Conflict (duplikat)
return NextResponse.json({ error: 'Jadwal sudah ada untuk dokter, tanggal, dan jam ini' }, { status: 409 })

// 500 Internal Server Error
return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
```

---

## Referensi Warna Blue Azure

```css
/* Palette utama */
--blue-50:  #EFF6FF;  /* Background surface ringan */
--blue-100: #DBEAFE;  /* Active menu background */
--blue-200: #BFDBFE;  /* Border / divider */
--blue-600: #2563EB;  /* Tombol primer */
--blue-700: #1D4ED8;  /* Tombol hover */
--blue-800: #1E40AF;  /* Teks aktif / dark accent */
--blue-900: #1E3A8A;  /* Heading gelap */

/* Azure custom */
--azure-primary: #1E6FBF;
--azure-surface: #E6F1FB;
--azure-dark:    #0C447C;
```

---

## Dependensi yang Dibutuhkan

```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
npm install react-hook-form zod @hookform/resolvers
npm install @tiptap/react @tiptap/starter-kit          # Rich text editor
npm install date-fns                                    # Format tanggal relatif
npm install zustand                                     # State management (toast, dll)
npm install clsx tailwind-merge                         # Utility class merging
```

---

*Generated for RS Bhayangkara Admin Panel — Next.js 14 + Supabase*