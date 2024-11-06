import express from "express";
import connectDB from "./config/Database.js";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoutes.js";
import PostsRoute from "./routes/PostsRoutes.js";
import CommentsRoute from "./routes/CommentRoutes.js";
import upload from "./multer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
connectDB();
const port = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PATCH, DELETE",
  })
);
app.use(express.json());

app.use(AuthRoute);
app.use(PostsRoute);
app.use(CommentsRoute);

// Route handle image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: true, message: "No image uploaded" });
    }
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// serve static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  try {
    console.log(`Server up and running port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
});
