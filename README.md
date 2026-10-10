# Nutrily Frontend

Frontend React/Vite untuk Nutrily. Backend Go berada di folder `../backend`.

## Menjalankan

1. Salin `.env.example` ke `.env.local`.
2. Atur `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`, dan `VITE_OAUTH_REDIRECT_URL`.
3. Jalankan `npm install` lalu `npm run dev`.

## Supabase Google OAuth

- Aktifkan Google di Supabase Dashboard → Authentication → Providers.
- Buat OAuth Client ID/Secret di Google Cloud; masukkan keduanya di Supabase Google Provider. Daftarkan callback URL Supabase (`https://<project-ref>.supabase.co/auth/v1/callback`) di Google Cloud.
- Tambahkan URL lokal dan URL produksi ke Authentication → URL Configuration → Redirect URLs.
- Google Client ID/Secret disimpan di Supabase Auth Provider, bukan di frontend `.env`. Jangan mengekspos Google Client Secret ke browser.

Route app: `/`, `/login`, `/register`, `/auth/callback`, `/reset-password`, `/onboarding`, `/dashboard`, `/scanner`, `/chat`, `/meals`.
