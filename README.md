# EduNova 2.0 FULL — AI-Nurturing Ultimate Lesson

**Versi penuh aplikasi pelajar kolej untuk Android APK + pratonton web.** Ini **bukan demo AI**: fungsi ringkasan AI sebenar memerlukan Cloudflare Worker + OpenAI API key yang dikonfigurasikan. Apabila AI tiada, sistem memaklumkan dengan jelas; ia **tidak** menggantikan AI dengan jawapan palsu.

## Ciri yang telah dilaksanakan

| Tab | Fungsi sebenar |
|---|---|
| 🎙 Nota AI | Transkripsi langsung Android (Capgo Speech Recognition), transkripsi audio daripada rakaman atau fail yang diimport (Whisper melalui Worker), AI hasilkan tajuk, kategori, bahasa dan ringkasan, nota manual juga disokong |
| 🎨 Studio Infografik (dalam Tab 1) | Bubble, Tree, Carta Alir, Mind Map, Banding dan Timeline; 5 gaya ilustrasi SVG Kartun, 3D Cute, Anime, Minimal dan Neon; edit, kongsi dan eksport |
| 🗂 Arkib | Nota dan infografik disimpan pada telefon; cari, edit, kongsi, padam |
| 📅 Jadual | Jadual mingguan Isnin–Ahad; tambah, edit dan buang sesi kuliah, semakan pertindihan |
| ✅ Tugasan | Tarikh akhir, subjek, keutamaan, tanda siap, edit, padam; Android Local Notifications jadual pada waktu yang dipilih |
| 👤 Profil | Nama, institusi, program pengajian, 6 tema warna, sambungan AI + ujian sambungan, sandaran dan pemulihan data |

**Tiada Google login.** Nota, infografik, jadual dan tugasan disimpan dalam storan peribadi aplikasi pada telefon. Tidak dihantar ke Drive. Jika aplikasi dipadam, data biasanya turut dipadam — gunakan **Profil → Eksport Sandaran JSON** sebelum tukar APK atau telefon.

## A. Naik taraf dari APK EduNova lama (PENTING)

1. Buka EduNova lama → **Profil → Eksport Sandaran JSON**. Simpan di lokasi selamat di telefon.
2. Jika pemasangan versi baharu menunjukkan `App not installed` / `package conflicts`, itu kerana **tandatangan debug APK daripada dua binaan GitHub mungkin berbeza**. **Uninstall APK lama hanya selepas sandaran berjaya dibuat**.
3. Pasang APK baharu daripada GitHub Actions.
4. Buka EduNova → **Profil → Import Sandaran** dan pilih fail JSON tadi. Nota dan jadual lama akan dipulihkan; nota contoh lama boleh dipadam secara manual. Kod akses AI tidak dieksport atas sebab keselamatan, jadi masukkan semula jika perlu.
5. Untuk kemas kini jangka panjang yang tidak perlu uninstall, gunakan APK **release bertandatangan dengan keystore yang sama** setiap kali.

## B. Cara paling mudah bina APK penuh di GitHub (tanpa Android Studio)

1. Ekstrak `EduNova_2_FULL_GitHub.zip`.
2. Pergi ke <https://github.com/new>, cipta repository contohnya `EduNova-Full`.
3. Buka repository → **Add file → Upload files**. Muat naik semua fail **di dalam** folder projek, termasuk folder tersembunyi `.github`. Fail `package.json`, `index.html` mesti berada di **root**, bukan dalam subfolder.
4. Klik **Commit changes**.
5. Buka **Actions → EduNova 2.0 - APK Lengkap (Pasang Terus) → Run workflow**.
6. Setelah hijau ✅, klik hasil workflow → **Artifacts → EduNova-2.0-APK-Lengkap** → muat turun. Ekstrak `app-debug.apk` daripada artifact ZIP.
7. Pasang APK pada Android. **Semua ciri aplikasi disertakan dalam APK ini**. `debug` bermaksud jenis tandatangan binaan, bukan versi demo fungsi.

Workflow menggunakan Node.js 22, Java 21, Android SDK API 36, pemasangan lesen automatik, kompilasi Capacitor 8, plugin mikrofon, notifikasi dan ikon EduNova.

## C. Sambung AI SEBENAR (perlu dibuat sekali sahaja)

**AI tidak akan menjana ringkasan sebenar tanpa perkhidmatan AI.** Langkah berikut memerlukan akaun Cloudflare dan OpenAI API (pengebilan API berasingan daripada langganan ChatGPT).

1. Log masuk <https://dash.cloudflare.com/> → **Workers & Pages** → **Create Worker**.
2. Buka **Edit code** dan gantikan dengan keseluruhan fail **`worker/worker.js`** dari pakej ini. Deploy.
3. Di halaman Worker → **Settings → Variables and Secrets** → tambah dua secret **berjenis Secret** (bukan plaintext dalam kod):
   - `OPENAI_API_KEY` = API key daripada platform OpenAI.
   - `APP_ACCESS_TOKEN` = kod akses panjang yang sukar diteka (cipta sendiri, contoh 30+ aksara rawak).
4. Simpan dan **Deploy** versi Worker terkini. Salin URL `https://....workers.dev`.
5. Buka EduNova pada telefon → **Profil → Sambungan AI** → masukkan URL Worker dan `APP_ACCESS_TOKEN` → klik **Simpan Sambungan**, kemudian **Uji Sambungan AI**.
6. Apabila ujian berjaya, pergi ke **Nota AI → Jana Nota Ringkas**. AI mengesan kategori dan bahasa, menghasilkan tajuk serta isi penting. Gunakan **Rakam untuk AI** atau **Fail Audio** untuk pengesanan bahasa automatik daripada audio.

**Perhatian penggunaan untuk ramai pelajar:** Satu kod akses Worker yang dikongsi bukan sistem pengesahan ramai pengguna. Hadkan pendedahan kod dan tambah sistem login/per-user rate limiting sebelum pelancaran meluas. Tetapkan had perbelanjaan API. Nota atau audio dihantar ke penyedia AI **hanya apabila pengguna memilih fungsi AI**. Pengecaman suara langsung Android mungkin menggunakan perkhidmatan pengecaman pertuturan peranti yang juga boleh menggunakan rangkaian. Dapatkan persetujuan pihak berkaitan sebelum merakam kuliah / mesyuarat.

## D. APK release bertandatangan (untuk pengedaran)

Workflow tambahan: **Actions → EduNova 2.0 - APK Release Bertandatangan**. Workflow ini menghasilkan `edunova-2.0-release.apk`, tetapi memerlukan **keystore milik anda sendiri**.

### Cara jana keystore

Pada komputer dengan Java JDK dipasang, jalankan (PowerShell / terminal):

```bash
keytool -genkeypair -v -keystore edunova-upload.jks -keyalg RSA -keysize 3072 -validity 10000 -alias edunova
```

Masukkan kata laluan rahsia dan identiti penandatangan apabila diminta. **Simpan fail `.jks` dan kata laluan dengan selamat; jangan upload `.jks` atau kata laluan ke folder projek.**

Untuk menukar fail keystore kepada base64 pada PowerShell Windows:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('edunova-upload.jks')) | Set-Clipboard
```

Kemudian di GitHub repository → **Settings → Secrets and variables → Actions → New repository secret**, buat 4 secret:

| Secret | Kandungan |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Kandungan base64 yang disalin ke clipboard |
| `ANDROID_KEYSTORE_PASSWORD` | Kata laluan fail `.jks` |
| `ANDROID_KEY_ALIAS` | `edunova` |
| `ANDROID_KEY_PASSWORD` | Kata laluan key alias (boleh sama dengan keystore jika anda tetapkan sama) |

Selepas itu, **Actions → EduNova 2.0 - APK Release Bertandatangan → Run workflow**. Ambil artifact `EduNova-2.0-APK-Release`. Untuk kemas kini yang lancar, gunakan **keystore yang sama** bagi setiap binaan akan datang. Untuk Google Play, biasanya AAB dan proses penerbitan tambahan diperlukan.

## E. Pratonton web

1. GitHub → **Settings → Pages** → Source **GitHub Actions**.
2. **Actions → Terbit Preview Web → Run workflow**.
3. Buka pautan Pages yang diberi. Nota/infografik/jadual/tugasan disokong dalam browser, tetapi notifikasi tugasan tidak boleh dipastikan ketika web ditutup dan plugin native hanya aktif dalam APK.

## F. Ujian penerimaan (selepas APK dipasang)

- Profil: simpan nama dan tukar tema.
- Jadual: tambah kelas, edit masa, lihat susunan minggu.
- Tugasan: buat tugasan 5–10 minit akan datang, benarkan notifikasi, semak peringatan.
- Nota: taip atau mula transkripsi, semak teks, kemudian simpan ke Arkib.
- AI: selepas sambungan Worker berjaya, jana ringkasan; fail audio perlu berada dalam had 24 MB.
- Infografik: pilih carta + gaya, jana, simpan dan eksport SVG.
- Sandaran: eksport JSON dan import pada pemasangan berasingan.

## Had yang perlu diketahui

- **Pengenalpastian bahasa** bukan jaminan untuk semua bahasa/loghat; bergantung pada sokongan model AI dan kualiti rakaman. Pengesanan bahasa *audio automatik* menggunakan transkripsi AI, sementara transkripsi langsung biasanya menggunakan bahasa pilihan/peranti.
- **Gaya 3D Cute dan Anime** ialah *templat ilustrasi SVG*, bukannya gambar AI fotorealistik; carta boleh diedit. Ini mengelakkan kos imej generatif setiap kali.
- **Peringatan tugasan** menggunakan notifikasi setempat Android dan boleh terlewat bergantung keizinan, mod bateri, dan dasar OS. Selepas mengaktifkan exact alarm pada tetapan Android, semak semula tugasan jika perlu.
- **Storan setempat** ialah data dalam aplikasi (bukan automatik berada di folder Downloads). Eksport atau kongsi secara manual jika mahu salinan luar.
- Pembangunan kod ini **belum** diuji pada semua telefon Android; binaan dan ujian perkakasan perlu dibuat melalui GitHub / peranti sendiri. Tiada API key yang disertakan dalam ZIP.

## Struktur projek

```text
EduNova-Full/
├── .github/workflows/
│   ├── android.yml               # APK binaan terus (lengkap)
│   ├── release.yml               # APK release ditandatangani
│   └── pages.yml                 # Pratonton GitHub Pages
├── android-assets/               # Ikon Android EduNova
├── branding/EduNova_Logo.png
├── public/
│   ├── app.js                    # Semua 5 tab & logik aplikasi
│   ├── style.css                 # UI responsif
│   ├── preview.html              # Pratonton pelayar
│   └── icon.svg
├── src/native.js                 # Plugin Android: fail, voice, share, notification
├── scripts/setup_android.py      # Manifest & ikon selepas cap add
├── worker/worker.js              # AI backend yang disambung melalui HTTPS
├── worker/wrangler.toml
├── capacitor.config.json
├── index.html
├── package.json
└── README.md
```
