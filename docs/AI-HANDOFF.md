# AI Handoff — LearnHarness LAN + mobile

> Ditulis 2026-11-05 sebagai snapshot sesi. Baca ini dulu sebelum menyentuh apa pun.

## Tujuan sesi ini
Menjalankan LearnHarness di jaringan lokal agar bisa dipakai dari HP
(Android/Chrome diuji via emulator; iPhone fisik belum diverifikasi),
dengan password gate + HTTPS (mkcert) + PWA.

## Status repo (branch `main`, tree BERSIH)
- `33ed697` fix: fail the LAN runner when static assets are missing ← HEAD
- `d644614` docs: add the change-networks runbook
- `9003dfa` docs: document the one-server Herd + LAN layout
- `b2b4478` feat: phone shell, PWA, and touch targets
- `4d51361` feat: add a password-gated LAN server
- `ebd9a65` fix: decode the JSON layer around escaped code fences
  (+ commit audit/layout/typeset/clarify/polish sebelumnya — lihat `git log`)

## Yang SUDAH selesai & terverifikasi
- LAN: `npm run lan` → Next standalone `127.0.0.1:3100` + TLS proxy
  `0.0.0.0:8443` (mkcert). Login cookie HttpOnly/SameSite/Secure OK,
  `/api/chats` 200, SSE `text/event-stream` 200 (ada frame `: connected`).
- Proxy `proxy.ts`: gate auth semua route kecuali `_next/static`,
  `_next/image`, ikon, manifest, sw.js, `/login`, `/api/auth/*`.
- Bug render: chunk `_next/static/*` pernah 500 karena `prepareStandalone`
  tidak menyalin `.next/static` — SUDAH diperbaiki + ada assert +
  smoke-test chunk CSS sebelum URL dicetak. Pelajaran: JANGAN percaya
  screenshot dev server; verifikasi SELALU via endpoint HTTPS LAN.
- Mobile shell: top bar 390px (judul penuh, phase hidden, plan icon-only),
  settings full-screen + tab horizontal, touch target 44px kontrol kunci,
  safe-area notch, teaser tanpa backtick, PWA (manifest, apple-icon,
  sw.js network-only passthrough).
- Herd: `learnharness.test` di-repoint ke `http://127.0.0.1:3100` —
  SATU server untuk Herd + LAN. Jangan jalankan `next dev` dan server LAN
  bersamaan di data root yang sama.
- mkcert CA: `.certs/lan.{crt,key}` untuk `<Mac>.local`, IP LAN, localhost.
  Browser Mac SUDAH trust (verified `ssl_verify_result = 0`).

## Yang BELUM / menunggu aksi manusia
- [ ] Trust CA di iPhone: AirDrop `rootCA.pem` → install profile →
      Settings → General → About → Certificate Trust Settings → ON.
      Tanpa ini: halaman blokir / PWA & mic mati.
- [ ] Uji di HP fisik: login → sesi → turn model → SSE reconnect
      (lock/background) → dictation → Add to Home Screen.
- [ ] (Opsional) `mkcert -install` di Mac: gagal karena butuh password sudo
      di terminal interaktif; tidak blocking karena verifikasi curl lolos.

## Sisa pekerjaan (prioritas)
1. **Graph interaktif mobile** (belum disentuh): canvas sigma
   `touch-none` — verifikasi pinch/pan benar jalan di sentuh; chrome
   kanan-atas → bottom sheet; node detail → full-screen sheet;
   render-settings + chain table responsif. PALING BERISIKO → kerjakan dulu.
2. **Dialog/menu sekunder**: model picker (popover w-[22rem] cek clipping
   390px), keyboard shortcuts table (max-w-36rem), plan popup, setup/delete
   confirm, demo/visual overlay.
3. **Onboarding/setup di HP**: BELUM DIPUTUSKAN. Opsi: (a) full setup flow
   di HP, (b) setup hanya di desktop, HP companion-only. Tanya user.
4. **Stats bar**: pill model membungkus 2 baris di 390px → truncate.
5. Detector CLI tersisa 3 false positive (blockquote `border-l-2`,
   2 spinner `border-b-2`) — jangan "diperbaiki".

## Cara menjalankan / verifikasi
- `npm run lan` (build + serve). `--no-build` untuk restart cepat.
  JANGAN jalankan dev server bersamaan (satu writer untuk `data/`).
- Cek cepat: `curl -sk -o /dev/null -w "%{http_code}\n"
  https://127.0.0.1:8443/_next/static/chunks/<file>.css` → harus 200.
- Visual: headless Chrome + UA iPhone, viewport 360/390/430, via endpoint
  HTTPS LAN (bukan dev server, bukan localhost dev).
- `npm test` (1 fail lama yang diketahui: `subscription-auth` pi-ai ESM),
  `npm run typecheck`, `npm run lint` (1 warning lama).
- `npm run lan -- --regen-cert` setelah ganti IP; `mkcert -install`
  sekali di Mac; trust CA sekali di iPhone.

## Jebakan yang sudah terbukti
- Standalone Next WAJIB punya `.next/standalone/.next/static` —
  `next build` tidak menyalinnya. `scripts/lan.mjs` sudah assert + smoke-test.
- Dev server di origin non-localhost = hydration mati total
  (`allowedDevOrigins`); JANGAN uji tampilan HP via URL IP + dev server.
- Global `* { border-color }` HARUS di `@layer base`, kalau tidak semua
  `border-primary`/focus ring mati (pernah kejadian, diperbaiki).
- Service worker: network-only, lewatkan `/api` dan `/_next` — JANGAN cache.

## Fase A graph mobile — selesai (2026-11-05)
- Chrome row: search jadi toggle ikon (controlled `mobileSearchOpen` untuk
  ⌘K, uncontrolled fallback), panel full-width di bawah row; import +
  chains + gear collapse jadi ikon 36px; testid baru `graph-search-toggle`,
  `graph-search-panel`.
- Settings = bottom sheet di HP (`max-sm:fixed inset-x-3 bottom-3`,
  `max-h-70dvh`, scroll internal). Kartu detail: tombol close eksplisit
  size-9 + provenance link min-h-11. Chain table: hit area + min-h-11 di
  semua baris/kontrol. Coverage popover: `max-w-[calc(100vw-2rem)]`.
- Test: pin SSR baru (toggle honesty, controlled open, trigger 36px) +
  update pin chain-row law (`max-sm:min-h-11`). 3201 tests: 1 fail lama
  (`subscription-auth` pi-ai ESM, tidak terkait).
- Verifikasi browser HP (headless Chrome 390px, build produksi via LAN):
  login pas, empty state jujur, chrome populated, panel search terbuka,
  bottom sheet settings, chain table collapse+expand (row 55px), nol
  console error, nol overflow. Detail card: KECUALI tap node — sim Fisika
  + GL headless tidak bisa diandalkan (lihat jebakan baru); kode di-review,
  seleksi tak tersentuh round ini. Verifikasi tap di iPhone fisik.
- Follow-up terlihat (DI LUAR Fase A, jangan dikerjakan diam-diam):
  pill model "muse-spark-1.3-contributor" wrap 3 baris + "xhigh" mepet
  tepi di composer HP; counts chain table ("1 …") truncate di 390px.

## Jebakan baru (terbukti 2026-11-05)
- Tsc incremental bisa laporkan error basi — hapus `tsconfig.tsbuildinfo`
  bila error menunjuk kode yang jelas sudah benar.
- Screenshot canvas GL headless tidak deterministik: sim yang sudah
  settle berhenti menggambar (buffer clear) + GPU process headless bisa
  mati diam-diam (DOM/probe tetap jalan, nol console error). Gejala:
  canvas hitam padahal chrome populated. Perbaikan: restart Chrome
  headless; verifikasi utama lewat probe DOM + settle pendek (1.2–2.5 dtk
  dari posisi tersebar), BUKAN screenshot canvas settle.
- Harness CDP sekali-pakai ada di `/tmp/cdp-check.mjs` (emulasi mobile,
  cookie auth, klik/tap, probe, screenshot). Sandbox via
  `LH_DATA_DIR=/tmp/... node .next/standalone/server.js` di port 3102 —
  JANGAN pakai data/ asli untuk seed uji; hapus salinan (berisi auth.json).

## Rapi kecil HP (2026-11-05)
- Pill model truncate di HP (`max-sm:max-w-20`), nama penuh di tooltip.
  Bar stats `max-sm:gap-2 px-2`. Awalnya max-w-28 → overflow 421 karena
  bar sudah di tepi; 20 + gap rapat = pas 390.
- Counts chain table `flex-none` (tetap tampil penuh), WRAPPER search
  yang menyusut (`max-sm:flex-1 min-w-0`, `sm:min-w-56` jaga desktop).
  Akar masalah: wrapper `shrink-0` tidak pernah menyusut — counts yang
  terpotong ("1 …") selama ini.
- Pelajaran verifikasi: sandbox 3102 HARUS dibunuh by-port
  (`lsof -tiTCP:3102 | xargs kill`) — cmdline-nya `next-server`, pola
  pkill nama file tidak kena → verifikasi bisa jalan di build basi.
- Full suite tetap 3196 + 1 fail lama (subscription-auth pi-ai ESM).
