# LAN + phone access

Run LearnHarness on the Mac and open it from a phone on the same Wi-Fi,
over HTTPS, behind a single password.

## Requirements

- Node.js 22+ and the repo's dependencies (`npm ci`).
- `mkcert` and `nss` (`brew install mkcert nss`), then `mkcert -install` once.
- The Mac awake; the phone on the same non-isolated Wi-Fi network.
- macOS firewall allows incoming connections for the TLS proxy (the first
  run may ask).

## First run

```bash
brew install mkcert nss
mkcert -install
npm run lan -- --init-auth     # writes LH_ACCESS_PASSWORD + LH_SESSION_SECRET to .env.local
npm run lan
```

The runner:

1. builds the production Next server;
2. creates `.certs/lan.crt` for `localhost`, `127.0.0.1`, `<Mac>.local` and the current LAN IP;
3. starts Next on `127.0.0.1:3100` (never exposed to the network);
4. starts the HTTPS proxy on `0.0.0.0:8443`;
5. prints the phone URLs.

Open `https://<Mac>.local:8443` (or the printed IP URL) on the phone.

To keep the Mac browser path too, point the Herd proxy at the *same*
server instead of running a second one: `herd proxy learnharness
http://127.0.0.1:3100 --secure`. Then `https://learnharness.test` and the
phone URLs share one production server and one `data/` root. Never run two
Next servers against the same data root.

`.env.local` is gitignored. Changing `LH_ACCESS_PASSWORD` logs every device
out; restart the runner after editing it. `npm run lan -- --regen-cert`
creates a new certificate after an IP change.

## Trust the certificate on the phone

The phone must trust mkcert's local CA, otherwise Safari blocks the page
and microphone access.

1. On the Mac: `open "$(mkcert -CAROOT)"`.
2. Send `rootCA.pem` to the phone (AirDrop is easiest) and install the profile.
3. iPhone: **Settings → General → About → Certificate Trust Settings** →
   enable full trust for the mkcert CA.
4. Reload the page and sign in.

## Password and session

- `LH_ACCESS_PASSWORD` in `.env.local` is the only password.
- The server sets a signed, HttpOnly, Secure, SameSite=Lax cookie for 30 days.
- Login attempts are rate-limited (5 per minute per client).
- **Settings → General → LAN access → Sign out** clears the cookie.
- With no `LH_ACCESS_PASSWORD`, the gate is off; local dev/Herd and the
  desktop shell keep their existing trusted behaviour.

## Data and concurrency

- The LAN server uses this repo's `data/` and `auth.json` — the same data
  as the current web/Herd session.
- Do **not** run the packaged Electron app and the LAN server against the
  same data root at the same time: the stores are single-writer.
- Back up `data/` and `auth.json` before first use and periodically.
- The Mac must stay awake; sleeping stops the server.

## Dictation

Dictation needs a secure context. The HTTPS proxy provides one, so the
microphone and Deepgram token route work on the phone after the certificate
is trusted. Deepgram still needs its key configured in Settings → Providers.

## Troubleshooting

- **`<Mac>.local` does not resolve**: use the printed IP URL; both are in
  the certificate.
- **Port already in use**: stop the dev server, or use
  `npm run lan -- --next-port 3101 --https-port 8444`.
- **Certificate warning**: install and trust `rootCA.pem` (above);
  regenerate with `--regen-cert` if the IP or hostname changed.
- **Phone cannot connect**: same Wi-Fi, no guest-network isolation;
  macOS firewall allows the proxy; Mac awake.
- **Logout loop / 401**: clear the site cookie, confirm `.env.local` has
  the intended password, restart the runner.

## Ganti Wi-Fi

Herd di Mac tidak ikut mati: `https://learnharness.test` berjalan di
atas loopback + DNS lokal Herd, bukan lewat Wi-Fi. Yang berubah hanya sisi
HP:

- IP Mac hampir pasti berubah (dulu `10.10.10.161` via DHCP). **Pakai
  `https://<Mac>.local:8443`** — nama ini ikut mesin ke jaringan mana pun
  lewat mDNS dan sudah tercakup di sertifikat.
- Jangan andalkan URL IP di jaringan baru: sertifikat terbit untuk IP
  lama sehingga browser menolaknya (cert mismatch). Kalau butuh URL IP,
  buat ulang sertifikatnya: `npm run lan -- --regen-cert`, atau jalankan
  ulang runner untuk melihat IP baru.
- HP dan Mac harus di SSID yang sama **tanpa client isolation atau
  captive portal**; jaringan tamu yang mengisolasi klien memblokir
  HP → Mac terlepas dari URL apa pun.
- Trust CA di HP cukup sekali; password dan data tidak berubah.
- PWA yang di-install dari URL `.local` tetap valid pindah jaringan
  karena `start_url`-nya `/` (relatif terhadap host yang dibuka).

## Scope

The LAN gate is a single-user convenience, not multi-user hosting. Do not
expose this port to the public internet. For remote access, use a private
tunnel or VPN instead.
