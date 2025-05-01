const itemRepository = require("../repository/item.repository");
const baseResponse = require("../utils/baseResponse.util");
const cloudinary = require("../utils/cloudinary.util");

exports.createItem = async (req, res) => {
    try {
        const newItem = await itemRepository.createItem(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Error creating item", error });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await itemRepository.updateItem(req.body);
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating item", error });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await itemRepository.getItemById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching item", error });
    }
};

exports.getItemsByStoreId = async (req, res) => {
    try {
        const items = await itemRepository.getItemsByStoreId(req.params.store_id);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items by store", error });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await itemRepository.deleteItem(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Item deleted successfully", deletedItem });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};