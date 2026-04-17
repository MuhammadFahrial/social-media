import express from "express";
import connectDB from "./config/Database.js";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoutes.js";
import PostsRoute from "./routes/PostsRoutes.js";
import CommentsRoute from "./routes/CommentRoutes.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./middleware/verifyToken.js";

dotenv.config();
const app = express();
connectDB();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: clientUrl,
    methods: "GET, POST, PATCH, DELETE",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/verify-token", verifyToken, (req, res) => {
  res.json({ valid: true });
});

app.use(AuthRoute);
app.use(PostsRoute);
app.use(CommentsRoute);

// Route handle image upload
// app.post("/image-upload", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file) {
//       res.status(400).json({ error: true, message: "No image uploaded" });
//     }
//     const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
//     res.status(201).json({ imageUrl });
//   } catch (error) {
//     res.status(500).json({ error: true, message: error.message });
//   }
// });

// Delete an image from uploads
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "ImageUrl parameter is required" });
  }

  try {
    // Extract the filename from imageUrl
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if the file exist
    if (fs.existsSync(filePath)) {
      // Delete the from the uploads folder
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image delete successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// serve static files from the uploads and assets directory

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  try {
    console.log(`Server up and running port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
});
