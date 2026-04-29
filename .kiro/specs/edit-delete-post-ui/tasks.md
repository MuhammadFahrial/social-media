# Tasks: Edit & Delete Post oleh Pemilik (UI)

## Task List

- [x] 1. Perbaiki backend authorization pada deletePosts
  - [x] 1.1 Uncomment blok pengecekan ownership di `server/controllers/PostsControllers.js` (`post.userId.toString() != req.userId`)
  - [x] 1.2 Verifikasi route `DELETE /v1/posts/:id` di `PostsRoutes.js` sudah menggunakan `verifyToken` middleware

- [x] 2. Buat komponen `PostActions`
  - [x] 2.1 Buat file `client/src/components/PostActions.jsx`
  - [x] 2.2 Komponen menerima props: `postId`, `isOwner`, `onEdit`, `onDelete`
  - [x] 2.3 Render tombol "Edit" dan "Delete" berdampingan hanya jika `isOwner === true`
  - [x] 2.4 Jika `isOwner === false`, render null

- [x] 3. Buat komponen `EditModal`
  - [x] 3.1 Buat file `client/src/components/EditModal.jsx`
  - [x] 3.2 Komponen menerima props: `postId`, `initialBody`, `onSave`, `onClose`
  - [x] 3.3 Internal state: `body` (string), `error` (string), `loading` (boolean)
  - [x] 3.4 Inisialisasi `body` state dengan nilai `initialBody` saat modal dibuka
  - [x] 3.5 Render textarea yang dapat diedit, tombol "Save", dan tombol "Cancel"
  - [x] 3.6 Tombol "Cancel" memanggil `onClose` tanpa perubahan
  - [x] 3.7 Validasi: jika `body.trim()` kosong saat "Save" diklik, set `error` dan jangan panggil API
  - [x] 3.8 Saat "Save" diklik dengan body valid: set `loading = true`, kirim `PATCH /v1/posts/:id` dengan Authorization header JWT
  - [x] 3.9 Jika request berhasil (status 201): panggil `onSave(postId, body)` lalu `onClose()`
  - [x] 3.10 Jika request gagal 403: set `error = "Anda tidak memiliki izin untuk mengedit post ini"`
  - [x] 3.11 Jika request gagal selain 403: set `error = "Terjadi kesalahan. Silakan coba lagi."`
  - [x] 3.12 Tombol "Save" dalam kondisi `disabled` saat `loading === true`
  - [x] 3.13 Set `loading = false` di blok `finally`

- [x] 4. Buat komponen `DeleteConfirmation`
  - [x] 4.1 Buat file `client/src/components/DeleteConfirmation.jsx`
  - [x] 4.2 Komponen menerima props: `postId`, `onConfirm`, `onClose`
  - [x] 4.3 Internal state: `error` (string), `loading` (boolean)
  - [x] 4.4 Render pesan konfirmasi yang menyebutkan tindakan tidak dapat dibatalkan
  - [x] 4.5 Render tombol "Confirm Delete" dan tombol "Cancel"
  - [x] 4.6 Tombol "Cancel" memanggil `onClose` tanpa perubahan
  - [x] 4.7 Saat "Confirm Delete" diklik: set `loading = true`, kirim `DELETE /v1/posts/:id` dengan Authorization header JWT
  - [x] 4.8 Jika request berhasil (status 200): panggil `onConfirm(postId)` lalu `onClose()`
  - [x] 4.9 Jika request gagal 404: set `error = "Post tidak ditemukan"`
  - [x] 4.10 Jika request gagal selain 404: set `error = "Terjadi kesalahan. Silakan coba lagi."`
  - [x] 4.11 Tombol "Confirm Delete" dalam kondisi `disabled` saat `loading === true`
  - [x] 4.12 Set `loading = false` di blok `finally`

- [x] 5. Integrasi ke halaman Home (`client/src/pages/home/index.jsx`)
  - [x] 5.1 Tambah state `currentUserId` (null), `editingPost` (null), `deletingPostId` (null)
  - [x] 5.2 Di `checkValidation`, set `currentUserId` dari `jwtDecode(token).id`
  - [x] 5.3 Tambah handler `handleEditSave(postId, newBody)`: update array `posts` secara lokal (map + replace body) tanpa memanggil ulang `getPost`
  - [x] 5.4 Tambah handler `handleDeleteConfirm(postId)`: filter array `posts` secara lokal untuk menghapus post tersebut tanpa memanggil ulang `getPost`
  - [x] 5.5 Di dalam render setiap post, tambahkan `<PostActions>` dengan `isOwner={post.userId === currentUserId}`
  - [x] 5.6 `onEdit` callback: set `editingPost = { id: post._id, body: post.body }`
  - [x] 5.7 `onDelete` callback: set `deletingPostId = post._id`
  - [x] 5.8 Render `<EditModal>` secara kondisional jika `editingPost !== null`
  - [x] 5.9 Render `<DeleteConfirmation>` secara kondisional jika `deletingPostId !== null`
  - [x] 5.10 Setelah modal/dialog ditutup, reset `editingPost` dan `deletingPostId` ke null

- [x] 6. Integrasi ke halaman DetailPosts (`client/src/pages/detail/detailPosts.jsx`)
  - [x] 6.1 Tambah state `currentUserId` (null), `postUserId` (null), `showEditModal` (false), `showDeleteConfirm` (false)
  - [x] 6.2 Di `checkValidation`, set `currentUserId` dari `jwtDecode(token).id`
  - [x] 6.3 Di `getPosts`, set `postUserId` dari `response.data.userId`
  - [x] 6.4 Tambah handler `handleEditSave(postId, newBody)`: set `body = newBody` secara lokal
  - [x] 6.5 Tambah handler `handleDeleteConfirm`: setelah delete berhasil, panggil `navigate('/')`
  - [x] 6.6 Render `<PostActions>` dengan `isOwner={postUserId === currentUserId}`
  - [x] 6.7 Render `<EditModal>` secara kondisional jika `showEditModal === true`
  - [x] 6.8 Render `<DeleteConfirmation>` secara kondisional jika `showDeleteConfirm === true`

- [x] 7. Tulis property-based tests menggunakan fast-checke
  - [x] 7.1 Install `fast-check` sebagai devDependency di `client/`
  - [x] 7.2 Tulis property test P1: ownership filtering — hanya post milik sendiri menampilkan PostActions
  - [x] 7.3 Tulis property test P2: edit modal pre-populated dengan body post yang benar
  - [x] 7.4 Tulis property test P3: cancel edit tidak mengubah post
  - [x] 7.5 Tulis property test P4: validasi input kosong/whitespace pada EditModal
  - [x] 7.6 Tulis property test P5: edit berhasil memperbarui state lokal tanpa GET call
  - [x] 7.7 Tulis property test P6: delete confirmation muncul dengan konten yang benar
  - [x] 7.8 Tulis property test P7: cancel delete tidak mengubah state posts
  - [x] 7.9 Tulis property test P8: delete berhasil menghapus post dari array state
  - [x] 7.10 Tulis property test P9: tombol submit disabled saat loading
  - [x] 7.11 Tulis property test P10: backend deletePosts mengembalikan 403 jika userId tidak cocok
  - [x] 7.12 Pastikan setiap property test dikonfigurasi dengan `numRuns: 100`

- [x] 8. Tulis unit/example tests
  - [x] 8.1 Test: tidak ada token → PostActions tidak dirender
  - [x] 8.2 Test: PUT return 403 → pesan error spesifik di EditModal
  - [x] 8.3 Test: PUT return 500 → pesan error generik di EditModal
  - [x] 8.4 Test: DELETE return 404 → pesan error spesifik di DeleteConfirmation
  - [x] 8.5 Test: DELETE return 500 → pesan error generik di DeleteConfirmation
  - [x] 8.6 Test: DELETE berhasil di DetailPosts → `navigate('/')` dipanggil
  - [x] 8.7 Smoke test: verifikasi pengecekan ownership aktif di `deletePosts` controller
