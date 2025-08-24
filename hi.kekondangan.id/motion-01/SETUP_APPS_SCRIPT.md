# Setup Google Apps Script untuk RSVP Form

## Langkah 1: Buat Google Apps Script

1. Buka [Google Apps Script](https://script.google.com/)
2. Klik **"New project"**
3. Ganti nama project menjadi **"Wedding RSVP Handler"**
4. Hapus kode default dan copy-paste kode dari file `Code.gs`

## Langkah 2: Deploy Web App

1. Di Apps Script editor, klik **"Deploy"** > **"New deployment"**
2. Pilih type: **"Web app"**
3. Atur pengaturan:
   - **Description**: "Wedding RSVP API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Klik **"Deploy"**
5. **COPY URL WEB APP** yang diberikan (contoh: https://script.google.com/macros/s/AKfycbx.../exec)

## Langkah 3: Update HTML

1. Buka file `index.html`
2. Cari baris: `const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';`
3. Ganti `YOUR_DEPLOYMENT_ID` dengan URL Web App yang sudah di-copy

## Langkah 4: Test Koneksi

1. Buka spreadsheet dengan ID: `1c74iEkjCkOkqcJxddyuCMbTLBiVICl1mzs2UgBDfOCI`
2. Pastikan sheet bernama "RSVP Data" akan otomatis dibuat
3. Test form RSVP di website
4. Cek apakah data masuk ke spreadsheet

## Struktur Data di Spreadsheet

| Timestamp | Nama | Kehadiran | Ucapan | IP Address |
|-----------|------|-----------|---------|------------|
| 24/08/2025 12:30:45 | John Doe | Hadir | Selamat ya! | 192.168.1.1 |

## Troubleshooting

**Jika form tidak berfungsi:**
1. Pastikan URL Web App sudah benar di HTML
2. Cek console browser untuk error (F12)
3. Pastikan Apps Script sudah di-deploy dengan akses "Anyone"
4. Cek apakah spreadsheet ID benar

**Jika data tidak masuk ke spreadsheet:**
1. Cek execution log di Apps Script
2. Pastikan spreadsheet dapat diakses oleh script
3. Cek format data yang dikirim

## Keamanan

- Script hanya menerima data nama, kehadiran, dan ucapan
- Input di-sanitize untuk mencegah XSS
- IP address dicatat untuk tracking (opsional)
- Validasi data dilakukan di server dan client side
