import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration
const storage = multer.memoryStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "./uploads/"); // Destination folder for storing uploaded images
  // },
  // filename: function (req, file, cb) {
  //   cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  // },
});

// File filter to accept only images
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// Initialize multer instance
// const upload = multer({ storage, fileFilter });
const upload = multer({ storage });

export default upload;
