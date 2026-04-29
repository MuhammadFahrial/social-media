# Requirements Document

## Introduction

Fitur ini menambahkan kemampuan bagi pengguna untuk mengedit dan menghapus post milik mereka sendiri pada aplikasi social media/blog. Tombol aksi hanya ditampilkan kepada pemilik post, edit dilakukan melalui modal inline, dan delete memerlukan konfirmasi. Setelah operasi berhasil, UI diperbarui secara real-time tanpa reload halaman penuh. Backend sudah menyediakan endpoint `PUT /v1/posts/:id` (updatePosts) dan `DELETE /v1/posts/:id` (deletePosts) yang memerlukan JWT Authorization header.

## Glossary

- **Post_Owner**: Pengguna yang sedang login dan memiliki `userId` yang sama dengan field `userId` pada post.
- **Feed**: Halaman Home (`/`) yang menampilkan daftar semua post.
- **Detail_Page**: Halaman detail post (`/posts/:id`) yang menampilkan satu post beserta komentar-komentarnya.
- **Edit_Modal**: Komponen overlay/dialog yang memungkinkan Post_Owner mengubah konten body post.
- **Delete_Confirmation**: Dialog konfirmasi yang muncul sebelum post dihapus secara permanen.
- **JWT**: JSON Web Token yang disimpan di `localStorage` dan digunakan sebagai Authorization header pada setiap request ke backend.
- **Current_User**: Pengguna yang sedang login, diidentifikasi melalui `userId` hasil decode JWT.
- **Post_Actions**: Grup tombol Edit dan Delete yang hanya terlihat oleh Post_Owner.
- **API_Client**: Modul axios yang digunakan untuk berkomunikasi dengan backend.

---

## Requirements

### Requirement 1: Tampilkan Tombol Aksi Hanya untuk Pemilik Post

**User Story:** Sebagai pengguna yang login, saya ingin tombol edit dan delete hanya muncul pada post milik saya, sehingga saya tidak bisa secara tidak sengaja mengubah atau menghapus post orang lain.

#### Acceptance Criteria

1. WHEN halaman Feed atau Detail_Page dirender, THE Post_Actions SHALL hanya ditampilkan pada post yang memiliki `userId` sama dengan `userId` Current_User hasil decode JWT.
2. WHEN halaman Feed atau Detail_Page dirender, THE Post_Actions SHALL tidak ditampilkan pada post yang `userId`-nya berbeda dari `userId` Current_User.
3. WHEN token tidak tersedia di `localStorage`, THE Post_Actions SHALL tidak ditampilkan pada post manapun.
4. THE Post_Actions SHALL menampilkan tombol "Edit" dan tombol "Delete" secara berdampingan pada setiap post milik Current_User.

---

### Requirement 2: Edit Post melalui Modal

**User Story:** Sebagai Post_Owner, saya ingin mengedit body post saya melalui sebuah modal, sehingga saya dapat memperbaiki atau memperbarui konten tanpa berpindah halaman.

#### Acceptance Criteria

1. WHEN Post_Owner mengklik tombol "Edit" pada sebuah post, THE Edit_Modal SHALL ditampilkan dengan nilai awal textarea berisi body post yang sedang diedit.
2. WHILE Edit_Modal terbuka, THE Edit_Modal SHALL menampilkan textarea yang dapat diedit dan dua tombol: "Save" dan "Cancel".
3. WHEN Post_Owner mengklik tombol "Cancel" pada Edit_Modal, THE Edit_Modal SHALL ditutup tanpa melakukan perubahan apapun pada post.
4. WHEN Post_Owner mengosongkan textarea lalu mengklik "Save", THE Edit_Modal SHALL menampilkan pesan error dan tidak mengirim request ke API_Client.
5. WHEN Post_Owner mengisi textarea dengan konten valid lalu mengklik "Save", THE API_Client SHALL mengirim request `PUT /v1/posts/:id` dengan Authorization header berisi JWT dan body berisi field `body` yang diperbarui.
6. WHEN request `PUT /v1/posts/:id` berhasil (status 201), THE Edit_Modal SHALL ditutup dan konten post pada UI SHALL diperbarui secara real-time tanpa reload halaman.
7. IF request `PUT /v1/posts/:id` mengembalikan status 403, THEN THE Edit_Modal SHALL menampilkan pesan error "Anda tidak memiliki izin untuk mengedit post ini".
8. IF request `PUT /v1/posts/:id` mengembalikan status selain 201 atau 403, THEN THE Edit_Modal SHALL menampilkan pesan error generik kepada Post_Owner.

---

### Requirement 3: Hapus Post dengan Konfirmasi

**User Story:** Sebagai Post_Owner, saya ingin ada konfirmasi sebelum post saya dihapus, sehingga saya tidak kehilangan post secara tidak sengaja.

#### Acceptance Criteria

1. WHEN Post_Owner mengklik tombol "Delete" pada sebuah post, THE Delete_Confirmation SHALL ditampilkan dengan pesan yang menyebutkan bahwa tindakan ini tidak dapat dibatalkan.
2. WHILE Delete_Confirmation ditampilkan, THE Delete_Confirmation SHALL menampilkan dua tombol: "Confirm Delete" dan "Cancel".
3. WHEN Post_Owner mengklik tombol "Cancel" pada Delete_Confirmation, THE Delete_Confirmation SHALL ditutup tanpa melakukan perubahan apapun.
4. WHEN Post_Owner mengklik tombol "Confirm Delete", THE API_Client SHALL mengirim request `DELETE /v1/posts/:id` dengan Authorization header berisi JWT.
5. WHEN request `DELETE /v1/posts/:id` berhasil (status 200), THE Feed SHALL menghapus post tersebut dari daftar secara real-time tanpa reload halaman.
6. WHEN request `DELETE /v1/posts/:id` berhasil pada Detail_Page, THE Detail_Page SHALL mengarahkan pengguna ke halaman Feed (`/`).
7. IF request `DELETE /v1/posts/:id` mengembalikan status 404, THEN THE Delete_Confirmation SHALL menampilkan pesan error "Post tidak ditemukan".
8. IF request `DELETE /v1/posts/:id` mengembalikan status selain 200 atau 404, THEN THE Delete_Confirmation SHALL menampilkan pesan error generik kepada Post_Owner.

---

### Requirement 4: Sinkronisasi State UI Real-Time

**User Story:** Sebagai Post_Owner, saya ingin perubahan pada post langsung terlihat di UI setelah operasi berhasil, sehingga saya mendapat feedback yang cepat tanpa harus me-refresh halaman.

#### Acceptance Criteria

1. WHEN operasi edit berhasil pada Feed, THE Feed SHALL memperbarui konten body post yang diedit di dalam array state `posts` secara lokal tanpa memanggil ulang API `GET /v1/posts`.
2. WHEN operasi delete berhasil pada Feed, THE Feed SHALL menghapus post dari array state `posts` secara lokal tanpa memanggil ulang API `GET /v1/posts`.
3. WHEN operasi edit berhasil pada Detail_Page, THE Detail_Page SHALL memperbarui state `body` dengan nilai baru yang telah disimpan.
4. WHILE operasi edit atau delete sedang diproses (request in-flight), THE Post_Actions SHALL menonaktifkan tombol "Save" atau "Confirm Delete" untuk mencegah pengiriman request duplikat.

---

### Requirement 5: Perbaikan Authorization pada deletePosts Backend

**User Story:** Sebagai administrator sistem, saya ingin endpoint delete post memvalidasi kepemilikan post, sehingga hanya pemilik post yang dapat menghapus post miliknya.

#### Acceptance Criteria

1. WHEN request `DELETE /v1/posts/:id` diterima dan `userId` pada token tidak sama dengan `userId` pada post, THE deletePosts SHALL mengembalikan status 403.
2. WHEN request `DELETE /v1/posts/:id` diterima dan `userId` pada token sama dengan `userId` pada post, THE deletePosts SHALL melanjutkan proses penghapusan post dan komentar terkait.
3. THE deletePosts SHALL mengaktifkan kembali pengecekan `post.userId.toString() != req.userId` yang saat ini di-comment out pada `PostsControllers.js`.
