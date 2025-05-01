// src/repositories/item.repositories.js
const db = require('../database/pg.database');
const cloudinary = require('../utils/cloudinary.util');

exports.createItem = async ({ name, price, store_id, image, stock }) => {
    try {
        let image_url = "";
        if (image && image.path) {
            console.log("Uploading image to Cloudinary:", image.path);
            const uploadResponse = await cloudinary.uploader.upload(image.path);
            imageUrl = uploadResponse.secure_url;
        }

        const query = `INSERT INTO items (name, price, store_id, image_url, stock) 
                       VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [name, price, store_id, image_url, stock || 0];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Database error in createItem:", error);
        throw error;
    }
};

exports.updateItem = async ({ id, name, price, store_id, image, stock }) => {
    try {
        let imageUrl = null;
        if (image && image.path) {
            console.log("Uploading new image to Cloudinary:", image.path);
            const uploadResponse = await cloudinary.uploader.upload(image.path);
            imageUrl = uploadResponse.secure_url;
        }

        const query = `UPDATE items 
                        SET name = $1, price = $2, store_id = $3, 
                            image_url = COALESCE($4, image_url), stock = $5
                       WHERE id = $6 RETURNING *`;
        const values = [name, price, store_id, imageUrl, stock || 0, id];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error("Database error in updateItem:", error);
        throw error;
    }
};

exports.getAllItems = async () => {
    try {
        const query = `SELECT * FROM items ORDER BY created_at DESC`;
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Database error in getAllItems:", error);
        throw error;
    }
};

exports.getItemById = async (id) => {
    try {
        const query = `SELECT * FROM items WHERE id = $1`;
        const values = [id];
        const result = await db.query(query, values);
        return result.rows[0];  
    } catch (error) {
        console.error("Database error in getItemById:", error);  
        throw error;
    }
};

exports.getItemsByStoreId = async (store_id) => {
    try {
        const query = `SELECT * FROM items WHERE store_id = $1`;
        const values = [store_id];

        console.log("Executing Query:", query, values);  
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        console.error("Database error in getItemsByStoreId:", error);  
        throw error;
    }
};

exports.deleteItem = async (id) => {
    try {
        const query = `DELETE FROM items WHERE id = $1 RETURNING *`;
        const values = [id];

        console.log("Executing DELETE Query:", query, values); 
        const result = await db.query(query, values);

        if (result.rowCount === 0) {
            console.log("Item not found for deletion:", id);
            return null; 
        }

        return result.rows[0];
    } catch (error) {
        console.error("Database error in deleteItem:", error);
        throw error;
    }
};
