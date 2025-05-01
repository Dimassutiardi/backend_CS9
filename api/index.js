const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk melayani file gambar
app.use("/images", express.static(path.join(__dirname, "images")));

// Konfigurasi multer untuk menyimpan file di folder "images"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images")); // Folder tempat menyimpan file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nama file unik
  },
});
const upload = multer({ storage });

// Endpoint untuk upload gambar
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const imageUrl = `http://localhost:${PORT}/images/${req.file.filename}`;
  res.status(200).json({ success: true, imageUrl });
});

// Endpoint untuk menerima data item dan gambar
app.post("/item", upload.single("image"), (req, res) => {
  const { name, price, store_id, stock } = req.body;
  const imageUrl = req.file
    ? `http://localhost:${PORT}/images/${req.file.filename}`
    : null;

  // Simpan data item ke database (contoh respons)
  const newItem = {
    id: Date.now(),
    name,
    price,
    store_id,
    stock,
    image_url: imageUrl,
  };

  console.log("Item created:", newItem);
  res.status(201).json({ success: true, item: newItem });
});

// Routes
app.use(`/user`, require(`../src/routes/user.route`));
app.use(`/store`, require(`../src/routes/store.route`));
app.use(`/item`, require(`../src/routes/item.route`));
app.use(`/transaction`, require(`../src/routes/transaction.route`));

// Default route untuk mengecek server berjalan
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
