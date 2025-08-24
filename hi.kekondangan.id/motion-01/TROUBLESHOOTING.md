# Troubleshooting RSVP Form ke Google Spreadsheet

## Langkah Debug

### 1. Update Google Apps Script
1. Buka [Google Apps Script](https://script.google.com/)
2. Pilih project "Wedding RSVP Handler"
3. **HAPUS semua kode lama** dan ganti dengan kode dari file `Code.gs` yang sudah diperbaiki
4. **SAVE** (Ctrl+S)
5. **DEPLOY ULANG**:
   - Klik "Deploy" > "Manage deployments"
   - Klik icon gear di sebelah deployment yang ada
   - Pilih "New version"
   - Klik "Deploy"

### 2. Test Koneksi Manual
1. Buka browser dan kunjungi URL Apps Script Anda:
   ```
   https://script.google.com/macros/s/AKfycbyVTtx3ZwkxoKtD3eocWOFIZG-ybzW47_UYKoFNDYEftqyRiyGXcWV6fgARKZt2HkT2XQ/exec
   ```
2. Jika berhasil, Anda akan melihat response JSON seperti:
   ```json
   {"success":true,"wishes":[],"count":0}
   ```

### 3. Debug di Browser
1. Buka website undangan Anda
2. Tekan **F12** untuk membuka Developer Tools
3. Klik tab **Console**
4. Coba isi form RSVP dan submit
5. Perhatikan pesan error di console

### 4. Kemungkinan Masalah dan Solusi

#### Error: "Failed to fetch"
**Penyebab**: CORS policy atau URL salah
**Solusi**:
- Pastikan URL Apps Script benar
- Deploy ulang dengan akses "Anyone"

#### Error: "Data tidak lengkap"
**Penyebab**: Form data tidak terkirim dengan benar
**Solusi**:
- Pastikan semua field form terisi
- Cek nama field di HTML

#### Error: "Spreadsheet not found"
**Penyebab**: ID spreadsheet salah atau tidak bisa diakses
**Solusi**:
- Pastikan ID spreadsheet benar: `1c74iEkjCkOkqcJxddyuCMbTLBiVICl1mzs2UgBDfOCI`
- Pastikan spreadsheet dapat diakses publik atau oleh akun yang sama

### 5. Test Langkah demi Langkah

#### Test 1: Akses Apps Script
```
Buka: https://script.google.com/macros/s/AKfycbyVTtx3ZwkxoKtD3eocWOFIZG-ybzW47_UYKoFNDYEftqyRiyGXcWV6fgARKZt2HkT2XQ/exec
Harapan: Melihat JSON response
```

#### Test 2: Submit Manual via URL
```
Buka: https://script.google.com/macros/s/AKfycbyVTtx3ZwkxoKtD3eocWOFIZG-ybzW47_UYKoFNDYEftqyRiyGXcWV6fgARKZt2HkT2XQ/exec?name=Test&attendance=Hadir&wish=Test%20message
Harapan: Data masuk ke spreadsheet
```

#### Test 3: Cek Console Browser
1. Buka website
2. F12 > Console
3. Submit form
4. Lihat log:
   - "Loading wishes from: ..."
   - "Response status: 200"
   - "Response data: ..."

### 6. Alternatif Jika Masih Gagal

Jika semua cara di atas gagal, gunakan method sederhana ini:

1. **Buat Google Form** sebagai backup:
   - Buka [Google Forms](https://forms.google.com/)
   - Buat form dengan field: Nama, Kehadiran, Ucapan
   - Embed ke website

2. **Gunakan service eksternal**:
   - Formspree.io
   - Netlify Forms
   - EmailJS

### 7. Cek Execution Log
1. Di Google Apps Script, klik "Executions"
2. Lihat log error terbaru
3. Klik pada execution yang error untuk detail

### 8. Verifikasi Permissions
1. Di Apps Script, klik "Triggers"
2. Pastikan tidak ada trigger yang conflict
3. Cek "Permissions" - pastikan script punya akses ke Google Sheets

## Pesan Error Umum

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `TypeError: Failed to fetch` | CORS/Network | Deploy ulang dengan akses "Anyone" |
| `SyntaxError: Unexpected token` | Response bukan JSON | Cek URL Apps Script |
| `Data tidak lengkap` | Form validation gagal | Cek field form |
| `Sheet tidak ditemukan` | Spreadsheet access | Cek ID dan permissions |

## Kontak Support
Jika masih bermasalah, kirim screenshot:
1. Console error di browser (F12)
2. Execution log di Apps Script
3. Response dari URL test manual
