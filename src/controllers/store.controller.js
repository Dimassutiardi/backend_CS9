const storeRepository = require("../repository/store.repository");
const baseResponse = require("../utils/baseResponse.util");

// Ambil semua store
exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    return baseResponse(res, true, 200, "Stores retrieved successfully", stores);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving stores", error.message);
  }
};

// Buat store baru
exports.createStore = async (req, res) => {
  const { name, address } = req.body;

  if (!name || !address) {
    return baseResponse(res, false, 400, "Name and address are required");
  }

  try {
    const store = await storeRepository.createStore(req.body);
    return baseResponse(res, true, 201, "Store created", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating store", error.message);
  }
};

// Ambil store berdasarkan ID
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL
    const store = await storeRepository.getStoreById(id); // Panggil fungsi repository

    if (!store) {
      return baseResponse(res, false, 404, "Store not found");
    }

    return baseResponse(res, true, 200, "Store found", store);
  } catch (error) {
    console.error(`[ERROR] getStoreById (id: ${req.params.id}):`, error);
    return baseResponse(res, false, 500, "Internal server error", error.message);
  }
}

// Update store berdasarkan ID
exports.updateStore = async (req, res) => {
  const { id, name, address } = req.body;

  if (!id || !name || !address) {
    return baseResponse(res, false, 400, "ID, name, and address are required");
  }

  try {
    const store = await storeRepository.updateStore(req.body);

    if (!store) {
      return baseResponse(res, false, 404, "Store not found");
    }

    return baseResponse(res, true, 200, "Store updated", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating store", error.message);
  }
};

// Hapus store berdasarkan ID
exports.deleteStore = async (req, res) => {
  console.log("DELETE /store/:id HIT"); // ← debug log

  try {
    const { id } = req.params;
    const store = await storeRepository.deleteStore(id);

    if (!store) {
      return baseResponse(res, false, 404, "Store not found");
    }

    return baseResponse(res, true, 200, "Store deleted", store);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting store", error.message);
  }
};


