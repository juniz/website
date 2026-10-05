# Frontend Docker Compose Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy Next.js frontend ke server production via `docker compose up -d --build`, semua konfigurasi dari `.env` server.

**Architecture:** Next.js `output: 'standalone'` + Dockerfile multi-stage (`deps` → `builder` → `runner`). `NEXT_PUBLIC_*` masuk sebagai build args (di-inline saat `next build`); `JWT_SECRET` sebagai runtime env. Container bind `127.0.0.1:${PORT:-3002}:3002`, nginx host jadi reverse proxy.

**Tech Stack:** Next.js 16.2.2, React 19, Node 22 (`node:22-bookworm-slim`), Docker Compose v2.

Spec: `docs/superpowers/specs/2026-10-05-frontend-docker-compose-design.md`

## Global Constraints

- Semua path relatif terhadap `frontend/` (repo git sendiri). Jalankan perintah dari `frontend/`.
- Base image: `node:22-bookworm-slim` (semua stage).
- Port container: `3002`. Host bind: `127.0.0.1:${PORT:-3002}:3002`.
- Build args wajib: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Opsional: `NEXT_PUBLIC_SITE_URL` (default `https://rsbhayangkaranganjuk.com`).
- Runtime env wajib: `JWT_SECRET` (harus sama dengan backend).
- Variabel wajib di compose pakai `${VAR:?... wajib diisi di .env}`.
- Container hanya menerima `NODE_ENV`, `TZ`, `JWT_SECRET` (tanpa `env_file`).
- `TZ=Asia/Jakarta`. `NEXT_TELEMETRY_DISABLED=1`.
- File `.env` tidak boleh masuk image maupun git.
- Docker **tidak terpasang** di mesin dev lokal. Verifikasi Docker dilakukan di server production (Task 4).
- Working tree punya 3 file modified dari bugfix sebelumnya (`src/app/(public)/{news/[slug],doctors/[id],pejabat/[slug]}/page.tsx`). Jangan ikut ter-commit di task ini — selalu `git add <path spesifik>`.

---

## File Structure

| File | Aksi | Tanggung jawab |
|---|---|---|
| `next.config.mjs` | Modify | Aktifkan `output: 'standalone'` |
| `Dockerfile` | Create | Build image multi-stage |
| `.dockerignore` | Create | Cegah `.env`, `node_modules`, artefak dev masuk build context |
| `docker-compose.yml` | Create | Service definition, mapping env → build args / runtime |
| `.env.example` | Create | Template variabel untuk operator server |
| `.gitignore` | Modify | Izinkan `.env.example` di-commit |

---

### Task 1: Standalone output

**Files:**
- Modify: `next.config.mjs:2` (awal objek `nextConfig`)

**Interfaces:**
- Produces: `npm run build` menghasilkan `.next/standalone/server.js` + `.next/static/`. Dikonsumsi Task 2 (`COPY` di stage runner).

- [ ] **Step 1: Pastikan belum ada standalone (baseline gagal)**

```bash
rm -rf .next && NEXT_PUBLIC_API_URL=https://api.itbhayangkara.id/api/v1 npm run build >/dev/null && ls .next/standalone/server.js
```

Expected: `ls: .next/standalone/server.js: No such file or directory`

- [ ] **Step 2: Tambah `output: 'standalone'`**

Ubah awal `next.config.mjs` menjadi:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle minimal untuk Docker image (lihat Dockerfile). Jalankan via `node server.js`.
  output: 'standalone',
  allowedDevOrigins: ['127.0.0.1'],
```

Sisa file tidak berubah.

- [ ] **Step 3: Build ulang, pastikan standalone muncul**

```bash
rm -rf .next && NEXT_PUBLIC_API_URL=https://api.itbhayangkara.id/api/v1 NEXT_PUBLIC_BACKEND_URL=https://api.itbhayangkara.id npm run build && ls .next/standalone/server.js
```

Expected: build sukses, output `.next/standalone/server.js`.

- [ ] **Step 4: Jalankan server standalone (simulasi stage runner)**

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cd .next/standalone && PORT=3099 HOSTNAME=127.0.0.1 JWT_SECRET=test node server.js
```

Biarkan berjalan (background), lanjut Step 5 di terminal lain.

- [ ] **Step 5: Smoke test + cek tracing dependency**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3099/robots.txt
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3099/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3099/news/imunisasi-perlindungan-penting-untuk-kesehatan-anak-dan-keluarga
```

Expected: tiga perintah pertama `200`. Log server **tanpa** `Cannot find module`.

Halaman news memakai `isomorphic-dompurify` (→ `jsdom`) — ini yang paling rawan miss saat tracing. Jika muncul `Cannot find module '<nama>'`, tambahkan ke `next.config.mjs` lalu ulangi Step 3–5:

```js
  output: 'standalone',
  outputFileTracingIncludes: {
    '/news/[slug]': ['./node_modules/<nama>/**/*'],
    '/pejabat/[slug]': ['./node_modules/<nama>/**/*'],
  },
```

- [ ] **Step 6: Matikan server, jalankan unit test**

Stop proses `node server.js` (Ctrl+C / kill). Lalu:

```bash
npm test -- --project unit --run
```

Expected: `Tests  22 passed (22)`.

- [ ] **Step 7: Commit**

```bash
git add next.config.mjs
git commit -m "build: enable next standalone output for docker"
```

> Catatan: setelah ini `next start` (dipakai deploy non-Docker lama via `npm start`) akan menampilkan warning bahwa standalone sebaiknya dijalankan via `node .next/standalone/server.js`. Masih jalan, tapi deploy lama sebaiknya pindah ke Docker.

---

### Task 2: Dockerfile + .dockerignore

**Files:**
- Create: `Dockerfile`
- Create: `.dockerignore`

**Interfaces:**
- Consumes: `.next/standalone/server.js`, `.next/static/`, `public/` dari Task 1.
- Produces: image dengan `ARG NEXT_PUBLIC_API_URL`, `ARG NEXT_PUBLIC_BACKEND_URL`, `ARG NEXT_PUBLIC_SITE_URL`, `ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY`; listen `0.0.0.0:3002`; `CMD ["node","server.js"]`. Dikonsumsi Task 3 (`build.args`).

- [ ] **Step 1: Buat `.dockerignore`**

```gitignore
# Dependencies & build output (di-install / di-build ulang di dalam image)
node_modules
.next
out
build
coverage
*.tsbuildinfo

# Secrets — jangan pernah masuk image
.env
.env.*
!.env.example

# VCS
.git
.gitignore

# Docker files sendiri
Dockerfile
.dockerignore
docker-compose*.yml

# Dev tooling, docs, storybook, tests
.storybook
storybook-static
*storybook.log
**/*.spec.*
**/*.stories.*
vitest.config.js
docs
scratch
graphify-out
design-system
.agents
.impeccable
*.md

# Local DB & one-off scripts
dev.db
test-db.js
fix_*.js

# Misc
*.log
.DS_Store
```

- [ ] **Step 2: Buat `Dockerfile`**

```dockerfile
# syntax=docker/dockerfile:1

# ── Stage 1: install dependencies ────────────────────────────────
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: build Next.js (standalone) ──────────────────────────
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# NEXT_PUBLIC_* di-inline ke bundle saat build → ganti nilai = wajib rebuild.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_SITE_URL=https://rsbhayangkaranganjuk.com
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── Stage 3: production runner ───────────────────────────────────
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3002 \
    HOSTNAME=0.0.0.0 \
    TZ=Asia/Jakarta \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3002
CMD ["node", "server.js"]
```

- [ ] **Step 3: Cek build context tidak memuat `.env` (tanpa Docker)**

`.dockerignore` memakai sintaks mirip `.gitignore`; cek pola secret tercakup:

```bash
grep -nE '^\.env$|^\.env\.\*$|^!\.env\.example$' .dockerignore
grep -nE '^COPY \. \.' Dockerfile
```

Expected: 3 baris match di `.dockerignore`, 1 baris match di `Dockerfile`.

- [ ] **Step 4: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "build: add multi-stage dockerfile for frontend"
```

Build image yang sebenarnya diverifikasi di Task 4 (Docker tidak ada di lokal).

---

### Task 3: docker-compose.yml + .env.example

**Files:**
- Create: `docker-compose.yml`
- Create: `.env.example`
- Modify: `.gitignore` (blok `# env files`, setelah baris `.env*`)

**Interfaces:**
- Consumes: build args & port dari Task 2.
- Produces: service `website-frontend`; operator cukup `cp .env.example .env` lalu `docker compose up -d --build`.

- [ ] **Step 1: Buat `docker-compose.yml`**

```yaml
# Production deploy frontend RS Bhayangkara Nganjuk.
# Pakai:  cp .env.example .env && nano .env && docker compose up -d --build
# Ganti NEXT_PUBLIC_*  → wajib rebuild (--build). Ganti JWT_SECRET saja → `docker compose up -d`.

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
      # Hanya localhost — publik lewat nginx reverse proxy di host.
      - "127.0.0.1:${PORT:-3002}:3002"
    environment:
      NODE_ENV: production
      TZ: Asia/Jakarta
      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET wajib diisi di .env (sama dengan backend)}
    healthcheck:
      # /robots.txt statis → tidak memicu fetch API, container tetap healthy saat API down.
      test: ["CMD-SHELL", "node -e \"require('http').get('http://127.0.0.1:3002/robots.txt', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))\""]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
```

- [ ] **Step 2: Buat `.env.example`**

```dotenv
# ─── Frontend production env ─────────────────────────────────────
# Salin: cp .env.example .env   (file .env JANGAN di-commit)

# ── BUILD-TIME (di-inline ke bundle saat `docker compose up --build`) ──
# Ganti nilai di bawah = WAJIB rebuild: docker compose up -d --build

# Base URL REST API backend (wajib)
NEXT_PUBLIC_API_URL=https://api.itbhayangkara.id/api/v1
# Origin backend untuk URL gambar /uploads (wajib, tanpa /api/v1)
NEXT_PUBLIC_BACKEND_URL=https://api.itbhayangkara.id
# URL publik website, dipakai untuk OG image (opsional)
NEXT_PUBLIC_SITE_URL=https://rsbhayangkaranganjuk.com
# Cloudflare Turnstile site key (wajib)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=

# ── RUNTIME (cukup `docker compose up -d`, tanpa rebuild) ──
# Harus SAMA dengan JWT_SECRET di backend (verifikasi login admin)
JWT_SECRET=

# ── Docker Compose (opsional) ──
# Port host, di-bind ke 127.0.0.1 → arahkan nginx proxy_pass ke sini
PORT=3002
CONTAINER_NAME=website-frontend
IMAGE_NAME=website-frontend:latest
```

- [ ] **Step 3: Izinkan `.env.example` di git**

Di `.gitignore`, ubah blok:

```gitignore
# env files (can opt-in for committing if needed)
.env*
```

menjadi:

```gitignore
# env files (can opt-in for committing if needed)
.env*
!.env.example
```

- [ ] **Step 4: Verifikasi git ignore**

```bash
git check-ignore -v .env.example; echo "exit=$?"
git check-ignore -v .env.local
```

Expected: baris pertama tanpa output lalu `exit=1` (tidak di-ignore). Baris kedua menunjukkan `.gitignore:...:.env*  .env.local` (tetap di-ignore).

- [ ] **Step 5: Validasi YAML (tanpa Docker)**

```bash
node -e 'const y=require("fs").readFileSync("docker-compose.yml","utf8"); const need=["website-frontend:","127.0.0.1:${PORT:-3002}:3002","JWT_SECRET: ${JWT_SECRET:?"]; const miss=need.filter(s=>!y.includes(s)); if(miss.length){console.error("missing:",miss);process.exit(1)} console.log("ok")'
```

Expected: `ok`. Validasi penuh (`docker compose config`) di Task 4.

- [ ] **Step 6: Commit**

```bash
git add docker-compose.yml .env.example .gitignore
git commit -m "build: add docker compose and env template for prod deploy"
```

---

### Task 4: Verifikasi di server production

**Files:** tidak ada perubahan kode. Dijalankan di server (yang punya Docker) setelah Task 1–3 di-push.

**Interfaces:**
- Consumes: semua artefak Task 1–3.

- [ ] **Step 1: Tarik kode & siapkan env**

```bash
cd <path-repo>/frontend
git pull
cp .env.example .env
nano .env   # isi NEXT_PUBLIC_TURNSTILE_SITE_KEY, JWT_SECRET (sama dengan backend/.env)
```

- [ ] **Step 2: Uji fail-fast variabel wajib**

```bash
JWT_SECRET= docker compose config >/dev/null; echo "exit=$?"
```

Expected: pesan `JWT_SECRET wajib diisi di .env (sama dengan backend)` dan `exit=` bukan 0.

```bash
docker compose config >/dev/null && echo ok
```

Expected: `ok`.

- [ ] **Step 3: Stop proses lama di port 3002**

Deploy lama (`npm start` / pm2) memakai port 3002 → bentrok.

```bash
pm2 ls            # cari proses frontend
pm2 stop <nama>   # atau: sudo ss -ltnp | grep 3002 → kill PID
```

Expected: `curl -sI http://127.0.0.1:3002/` gagal connect.

- [ ] **Step 4: Build & jalankan**

```bash
docker compose up -d --build
docker compose ps
```

Expected: build sukses; setelah ±30–60 detik `STATUS` berisi `(healthy)`.

- [ ] **Step 5: Cek log tracing**

```bash
docker compose logs --tail=100 website-frontend | grep -iE "cannot find module|error" || echo "clean"
```

Expected: `clean` (atau hanya error fetch API yang wajar). Jika `Cannot find module` → kembali ke Task 1 Step 5 (`outputFileTracingIncludes`).

- [ ] **Step 6: Smoke test lewat container & nginx**

```bash
for p in / /robots.txt /news/imunisasi-perlindungan-penting-untuk-kesehatan-anak-dan-keluarga /doctors /admin; do
  printf "%-80s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3002$p)"
done
curl -sI https://rsbhayangkaranganjuk.com/news/imunisasi-perlindungan-penting-untuk-kesehatan-anak-dan-keluarga | head -1
```

Expected: `/`, `/robots.txt`, `/news/...`, `/doctors` → `200`; `/admin` → `307` (redirect ke `/login`, membuktikan `JWT_SECRET`/middleware jalan). Publik → `HTTP/2 200`.

- [ ] **Step 7: Catat ukuran image**

```bash
docker image ls website-frontend
```

Expected: < 400 MB.

- [ ] **Step 8: Pastikan port tidak terbuka publik**

```bash
sudo ss -ltnp | grep 3002
```

Expected: listen di `127.0.0.1:3002`, bukan `0.0.0.0:3002`.

Rollback bila gagal: `docker compose down && pm2 start <nama>`.
