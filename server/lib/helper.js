import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",

        //  -- BAGIAN CROP ---
        transformation: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "face",
          },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      }, //auto detect (jpg, png, pdf, dll)
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
