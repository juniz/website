# Frontend Docker Compose — Production Deploy Design

Date: 2026-10-05
Status: Approved (design), pending spec review

## Goal

Deploy Next.js frontend (`frontend/`) ke server production via Docker Compose. Semua konfigurasi dari file `.env` di server. Tidak ada nilai rahasia/URL hardcode di image atau compose.

## Decisions

| Topik | Keputusan | Alasan |
|---|---|---|
| Lokasi build | Di server production: `docker compose up -d --build` | Tanpa registry/CI. `NEXT_PUBLIC_*` dibaca dari `.env` server. |
| Networking | Port bind `127.0.0.1:${PORT:-3002}:3002`, nginx host reverse proxy | Tidak terekspos publik langsung. Konsisten dengan port prod sekarang (`next start -p 3002`). |
| Akses API | Via URL publik (`https://api.itbhayangkara.id/api/v1`) | Frontend tidak bergantung pada topologi container backend. |
| Mode image | Next.js `output: 'standalone'` | Image kecil (~150–250 MB vs ~800 MB+), pola resmi Next.js. |
| Base image | `node:22-bookworm-slim` | Sama dengan backend. |

## Environment Variables

Next.js meng-inline `NEXT_PUBLIC_*` ke bundle saat `next build`. Ganti nilai di runtime tidak berefek → wajib rebuild.

| Variabel | Fase | Wajib | Dipakai di |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | build | ya | `src/lib/api.ts` (base URL API) |
| `NEXT_PUBLIC_BACKEND_URL` | build | ya | `src/lib/utils.ts`, `src/app/api/image/route.js` (URL gambar/uploads) |
| `NEXT_PUBLIC_SITE_URL` | build | tidak (default `https://rsbhayangkaranganjuk.com`) | `src/lib/utils.ts` (OG image URL) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build | ya | `src/components/common/Turnstile.tsx` |
| `JWT_SECRET` | runtime | ya | `middleware.js` (verifikasi cookie admin; harus sama dengan backend) |
| `PORT` | compose | tidak (default `3002`) | port host yang di-bind ke `127.0.0.1` |
| `CONTAINER_NAME` | compose | tidak (default `website-frontend`) | nama container |
| `IMAGE_NAME` | compose | tidak (default `website-frontend:latest`) | tag image |

Variabel wajib memakai sintaks `${VAR:?pesan}` di compose → `docker compose` gagal cepat bila kosong, bukan diam-diam fallback ke `http://localhost:3001` atau `fallback-secret-for-dev-only`.

## Files

### Baru

1. **`frontend/Dockerfile`** — multi-stage:
   - `deps`: copy `package*.json`, `npm ci`.
   - `builder`: copy source; `ARG` keempat `NEXT_PUBLIC_*` → `ENV`; `NEXT_TELEMETRY_DISABLED=1`; `npm run build`.
   - `runner`: `NODE_ENV=production`, `PORT=3002`, `HOSTNAME=0.0.0.0`, `TZ=Asia/Jakarta`, `NEXT_TELEMETRY_DISABLED=1`. Copy `public/`, `.next/standalone/`, `.next/static/` (owner `node`). `USER node`. `EXPOSE 3002`. `CMD ["node", "server.js"]`.
2. **`frontend/.dockerignore`** — exclude: `node_modules`, `.next`, `out`, `coverage`, `.env`, `.env.*` (kecuali `.env.example`), `.git`, `.gitignore`, `.storybook`, `storybook-static`, `*storybook.log`, `graphify-out`, `scratch`, `docs`, `.agents`, `.impeccable`, `design-system`, `dev.db`, `test-db.js`, `fix_*.js`, `*.tsbuildinfo`, `*.log`, `.DS_Store`, `**/*.spec.*`, `**/*.stories.*`, `Dockerfile`, `docker-compose*.yml`.
3. **`frontend/docker-compose.yml`**:
   ```yaml
   services:
     website-frontend:
       container_name: ${CONTAINER_NAME:-website-frontend}
       build:
         context: .
         dockerfile: Dockerfile
         args:
           NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:?NEXT_PUBLIC_API_URL wajib diisi di .env}
           NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL:?NEXT_PUBLIC_BACKEND_URL wajib diisi di .env}
           NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL:-https://rsbhayangkaranganjuk.com}
           NEXT_PUBLIC_TURNSTILE_SITE_KEY: ${NEXT_PUBLIC_TURNSTILE_SITE_KEY:?NEXT_PUBLIC_TURNSTILE_SITE_KEY wajib diisi di .env}
       image: ${IMAGE_NAME:-website-frontend:latest}
       restart: unless-stopped
       ports:
         - "127.0.0.1:${PORT:-3002}:3002"
       environment:
         NODE_ENV: production
         TZ: Asia/Jakarta
         JWT_SECRET: ${JWT_SECRET:?JWT_SECRET wajib diisi di .env (sama dengan backend)}
       healthcheck:
         test: ["CMD-SHELL", "node -e \"require('http').get('http://127.0.0.1:3002/robots.txt', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))\""]
         interval: 30s
         timeout: 10s
         retries: 3
         start_period: 30s
   ```
   - Hanya variabel yang dibutuhkan yang diteruskan ke container (bukan `env_file` seluruh `.env`) → `NEXT_PUBLIC_*` tidak menyesatkan seolah bisa diganti runtime.
   - Healthcheck ke `/robots.txt` (route statis) → tidak memicu fetch ke API, container tidak ditandai unhealthy saat API down.
4. **`frontend/.env.example`** — template semua variabel di tabel di atas, dengan komentar build-time vs runtime dan nilai contoh production.

### Diubah

- **`frontend/next.config.mjs`**: tambah `output: 'standalone'`.
- **`frontend/.gitignore`**: tambah `!.env.example` setelah `.env*` agar template ter-commit.

## Deploy Flow (server)

```bash
cd frontend
cp .env.example .env && nano .env
docker compose up -d --build
docker compose ps        # STATUS: healthy
```

Update kode / ganti `NEXT_PUBLIC_*`: `git pull && docker compose up -d --build`.
Ganti `JWT_SECRET` saja: `docker compose up -d` (tanpa rebuild).

## Verification

1. `docker compose build` lokal dengan `.env` berisi URL production API.
2. `docker compose up -d`, tunggu `healthy`.
3. `curl -I http://127.0.0.1:3002/` → 200.
4. `curl -I http://127.0.0.1:3002/news/imunisasi-perlindungan-penting-untuk-kesehatan-anak-dan-keluarga` → 200 (regresi bug static-to-dynamic).
5. `curl -I http://127.0.0.1:3002/robots.txt` → 200.
6. Hapus satu variabel wajib dari `.env` → `docker compose config` gagal dengan pesan `wajib diisi`.
7. `docker image ls` → ukuran image runner tercatat.
8. Cek log container tidak ada `Cannot find module` (risiko tracing standalone untuk `isomorphic-dompurify`/`jsdom`). Bila ada: tambah `outputFileTracingIncludes` di `next.config.mjs`.

## Out of Scope

- Konfigurasi nginx reverse proxy.
- CI/CD, registry, image push.
- Compose gabungan backend + frontend.
- Perubahan `backend/docker-compose.aapanel.yml` (contoh lama, `bios-frontend`, var `NEST_BACKEND_URL` tidak dipakai kode).
