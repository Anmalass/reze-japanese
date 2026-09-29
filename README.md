# REZE Japanese 日本語を学ぼう
Aplikasi belajar Jepang offline-first (HTML/CSS/JS + Capacitor). Package ID: com.anma.rezejapanese.
## Build APK via GitHub
Upload ke GitHub → Actions → Build APK → Run workflow → unduh artifact `reze-japanese-debug-apk`.
## Build lokal
npm install; npx cap add android; npx cap sync android; cd android; ./gradlew assembleDebug
Hasil: android/app/build/outputs/apk/debug/app-debug.apk
## Menambah konten
Lesson: tambahkan objek di `www/data/lessons.json` dengan `items: [[jepang, romaji, arti], ...]` (kalimat berspasi otomatis jadi soal susun kata).
Sensei: tambah intent di `www/data/sensei.json`. Suara: fungsi `speak()` di `app.js` (mudah diganti engine TTS). Tema: variabel di `style.css`.
Catatan: speech recognition sering tidak tersedia di Android WebView; ada fallback ketik.
