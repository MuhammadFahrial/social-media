# Social Media App

A full-stack social media application built with **React** on the frontend and **Express + MongoDB** on the backend. Users can register, create posts, and comment on content.

---

## Tech Stack

**Client**
- React 18
- React Router v6
- Axios
- JWT Decode

**Server**
- Node.js + Express
- MongoDB + Mongoose
- Argon2 (password hashing)
- JSON Web Tokens (auth)
- Multer + Cloudinary (image uploads)

---

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
└── package.json     # Root scripts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repo

```bash
git clone <repo-url>
cd social-media
```

### 2. Configure environment variables

**Server** — copy `server/.env.example` to `server/.env` and fill in:

```env
MONGODB_URI=your_mongodb_url
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Client** — copy `client/.env.example` to `client/.env` and fill in:

```env
REACT_APP_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 4. Run the app

From the root directory:

```bash
npm start
```

This starts both the server and client concurrently.

- Client: [http://localhost:3000](http://localhost:3000)
- Server: [http://localhost:5000](http://localhost:5000)

Or run them individually:

```bash
# Server only
cd server && npm start

# Client only
cd client && npm start
```

---

## API Reference

Base URL: `http://localhost:<PORT>`

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user (supports file upload) | No |
| `POST` | `/auth/login` | Login and receive a JWT | No |
| `DELETE` | `/auth/logout` | Logout current user | No |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/v1/users` | Get all users | No |
| `GET` | `/v1/users/:id` | Get user by ID | No |
| `GET` | `/v1/users/username/:username` | Get user by username | No |
| `DELETE` | `/v1/users/:id` | Delete a user | No |

### Posts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/v1/posts` | Get all posts | No |
| `GET` | `/v1/posts/:id` | Get post by ID | No |
| `POST` | `/v1/posts` | Create a new post | Yes |
| `PATCH` | `/v1/posts/:id` | Update a post | Yes |
| `DELETE` | `/v1/posts/:id` | Delete a post | Yes |

### Comments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/v1/comments` | Get all comments | No |
| `GET` | `/v1/comments/:postId` | Get comments by post ID | No |
| `POST` | `/v1/comments/:id` | Create a comment | Yes |
| `PATCH` | `/v1/comments/:id` | Update a comment | Yes |
| `DELETE` | `/v1/comments/:id` | Delete a comment | Yes |

> **Auth: Yes** — requires a valid JWT passed as a cookie or Authorization header.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` (root) | Start both client and server |
| `npm start` (server) | Start server with nodemon |
| `npm start` (client) | Start React dev server |
| `npm run build` (client) | Build client for production |

---

## Deployment

The server includes a `vercel.json` config for deploying to [Vercel](https://vercel.com). Make sure to set all environment variables in your Vercel project settings before deploying.
