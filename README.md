# Socialite

Aplikasi social media berbasis web yang memungkinkan pengguna untuk membuat post, berkomentar, menyimpan favorit, dan mengelola konten mereka sendiri. Dibangun dengan React di sisi frontend dan Node.js/Express + MongoDB di sisi backend.

---

## Tech Stack

**Frontend**
- React 18
- React Router DOM v6
- Axios
- jwt-decode
- CSS custom (Instagram-inspired UI)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Argon2 (password hashing)
- Multer + Cloudinary (upload gambar profil)
- CORS

---

## Fitur

- **Autentikasi** — Register dengan foto profil, Login, Logout
- **Feed** — Lihat semua post, buat post baru
- **Edit & Delete Post** — Hanya pemilik post yang dapat mengedit atau menghapus postnya
- **Komentar** — Tambah komentar pada setiap post
- **Favorit** — Simpan post ke daftar favorit (disimpan di localStorage)
- **Explore** — Cari post berdasarkan konten atau nama pengguna
- **Detail Post** — Halaman detail post dengan daftar komentar
- **Settings** — Halaman pengaturan akun
- **Responsive** — Tampilan menyesuaikan desktop, tablet, dan mobile

---

## Struktur Proyek

```
social-media/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── assets/          # Gambar statis
│       ├── components/      # Komponen reusable
│       │   ├── DeleteConfirmation.jsx
│       │   ├── EditModal.jsx
│       │   ├── Info.jsx
│       │   ├── Navbar.jsx
│       │   ├── PostActions.jsx
│       │   └── Sidebar.jsx
│       ├── layout/
│       │   └── Layout.jsx
│       ├── lib/
│       │   ├── useFavorites.js  # Custom hook favorit
│       │   └── utils.js
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── detail/
│       │   │   └── detailPosts.jsx
│       │   ├── explore/
│       │   ├── favorites/
│       │   ├── home/
│       │   └── settings/
│       ├── App.jsx
│       ├── index.css
│       ├── index.jsx
│       └── router.js
│
├── server/                  # Express backend
│   ├── config/
│   │   ├── Database.js      # Koneksi MongoDB
│   │   └── multer.js        # Konfigurasi upload
│   ├── controllers/
│   │   ├── CommentsControllers.js
│   │   ├── PostsControllers.js
│   │   └── UsersControllers.js
│   ├── middleware/
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── CommentsModels.js
│   │   ├── PostsModels.js
│   │   └── UsersModels.js
│   ├── routes/
│   │   ├── AuthRoutes.js
│   │   ├── CommentRoutes.js
│   │   └── PostsRoutes.js
│   └── index.js
│
└── package.json             # Root script untuk menjalankan keduanya
```

---

## Instalasi & Menjalankan

### Prasyarat

- Node.js >= 18
- MongoDB (lokal atau MongoDB Atlas)
- Akun Cloudinary (untuk upload gambar profil)

### 1. Clone repository

```bash
git clone <repo-url>
cd social-media
```

### 2. Setup Backend

```bash
cd server
npm install
```

Buat file `.env` berdasarkan `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Buat file `.env` berdasarkan `.env.example`:

```env
REACT_APP_URL=http://localhost:5000
```

### 4. Jalankan Aplikasi

Dari root folder, jalankan keduanya sekaligus:

```bash
npm start
```

Atau jalankan secara terpisah:

```bash
# Terminal 1 — Backend
cd server && npm start

# Terminal 2 — Frontend
cd client && npm start
```

Aplikasi akan berjalan di:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

---

## API Endpoints

### Auth

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Daftar akun baru (multipart/form-data) |
| POST | `/auth/login` | Login dan dapatkan JWT |
| DELETE | `/auth/logout` | Logout |
| GET | `/verify-token` | Verifikasi JWT |

### Users

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/v1/users` | Ambil semua user |
| GET | `/v1/users/:id` | Ambil user berdasarkan ID |
| GET | `/v1/users/username/:username` | Cari user berdasarkan username |
| DELETE | `/v1/users/:id` | Hapus user |

### Posts

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/v1/posts` | — | Ambil semua post |
| GET | `/v1/posts/:id` | — | Ambil post berdasarkan ID |
| POST | `/v1/posts` | ✅ | Buat post baru |
| PATCH | `/v1/posts/:id` | ✅ | Edit post (hanya pemilik) |
| DELETE | `/v1/posts/:id` | ✅ | Hapus post (hanya pemilik) |

### Comments

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/v1/comments` | — | Ambil semua komentar |
| GET | `/v1/comments/:postId` | — | Ambil komentar berdasarkan post |
| POST | `/v1/comments/:id` | ✅ | Tambah komentar |
| PATCH | `/v1/comments/:id` | ✅ | Edit komentar |
| DELETE | `/v1/comments/:id` | ✅ | Hapus komentar |

> ✅ = Memerlukan header `Authorization: Bearer <token>`

---

## Data Model

### User

```js
{
  username: String,   // required
  email:    String,   // required
  password: String,   // hashed dengan Argon2
  role:     String,
  image:    String    // URL gambar profil (Cloudinary)
}
```

### Post

```js
{
  userId:   ObjectId,   // referensi ke Users
  author:   [String],   // nama pengguna
  image:    String,     // URL foto profil penulis
  body:     String,     // required
  date:     Date,
  comments: [ObjectId]  // referensi ke Comments
}
```

### Comment

```js
{
  body:   String,
  date:   Date,
  author: String,
  image:  String,     // URL foto profil komentator
  userId: ObjectId,   // referensi ke Users
  postId: ObjectId    // referensi ke Posts
}
```

---

## Halaman Aplikasi

| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/login` | Login | Form login |
| `/register` | Register | Form daftar akun baru |
| `/` | Home / Feed | Daftar semua post, form buat post |
| `/posts/:id` | Detail Post | Detail post + komentar |
| `/explore` | Explore | Cari post atau pengguna |
| `/favorites` | Favorites | Post yang disimpan |
| `/settings` | Settings | Pengaturan akun |

---

## Deployment

Backend sudah dikonfigurasi untuk Vercel melalui `server/vercel.json`. Untuk deploy:

1. Push ke repository GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables sesuai `.env.example`
4. Deploy

---

## Lisensi

MIT
