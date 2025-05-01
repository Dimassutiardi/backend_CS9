const db = require("../database/pg.database");

// Ambil semua store
exports.getAllStores = async () => {
  try {
    const res = await db.query("SELECT * FROM stores ORDER BY created_at DESC");
    return res.rows;
  } catch (error) {
    console.error("[ERROR] getAllStores:", error);
    throw error;
  }
};

// Buat store baru
exports.createStore = async (store) => {
  try {
    const res = await db.query(
      "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
      [store.name, store.address]
    );
    return res.rows[0];
  } catch (error) {
    console.error("[ERROR] createStore:", error);
    throw error;
  }
};

// Ambil store berdasarkan ID
exports.getStoreById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM stores WHERE id = $1", [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(`[ERROR] getStoreById (id: ${id}):`, error);
    throw error;
  }
};

// Update store berdasarkan ID
exports.updateStore = async (store) => {
  try {
    const res = await db.query(
      "UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
      [store.name, store.address, store.id]
    );
    return res.rows.length > 0 ? res.rows[0] : null; // Pastikan store ditemukan
  } catch (error) {
    console.error(`[ERROR] updateStore (id: ${store.id}):`, error);
    throw error;
  }
};

// Hapus store berdasarkan ID
exports.deleteStore = async (id) => {
  try {
    const res = await db.query(
      "DELETE FROM stores WHERE id = $1 RETURNING *",
      [id]
    );
    return res.rows.length > 0 ? res.rows[0] : null; // Pastikan store ditemukan
  } catch (error) {
    console.error(`[ERROR] deleteStore (id: ${id}):`, error);
    throw error;
  }
};
