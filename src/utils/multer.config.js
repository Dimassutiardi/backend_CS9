const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder uploads ada
const uploadPath = path.join(__dirname, "../uploads/");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// Filter hanya menerima file gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images (JPEG, PNG, GIF) are allowed"), false);
    }
};

// Konfigurasi multer dengan batasan ukuran file 5MB
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
