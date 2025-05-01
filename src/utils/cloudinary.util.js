const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (file) => {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "uploads" }, // Folder di Cloudinary
      (error, result) => {
        if (error) {
          console.error("Upload to Cloudinary failed:", error);
          reject(null);
        } else {
          resolve(result.secure_url); // URL gambar setelah diunggah
        }
      }
    );

    // Mengubah buffer ke stream dan mengirim ke Cloudinary
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
