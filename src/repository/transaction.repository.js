const db = require("../database/pg.database");

exports.createTransaction = async ({ item_id, quantity, user_id }) => {
    try {
        if (quantity <= 0) {
            throw new Error("Quantity must be larger than 0");
        }

        const query = `
            INSERT INTO transactions (user_id, item_id, quantity, total, status, created_at) 
            VALUES ($1, $2, $3, (SELECT price FROM items WHERE id = $2) * $3, 'pending', NOW()) 
            RETURNING *;
        `;
        const values = [user_id, item_id, quantity];

        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

exports.payTransaction = async (transactionId) => {
    try {
        const query = `
            UPDATE transactions 
            SET status = 'paid' 
            WHERE id = $1 
            RETURNING *;
        `;
        const result = await db.query(query, [transactionId]);
        if (result.rows.length === 0) {
            throw new Error("Failed to pay");
        }

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

exports.deleteTransaction = async (transactionId) => {
    try {
        const query = `DELETE FROM transactions WHERE id = $1 RETURNING *;`;
        const result = await db.query(query, [transactionId]);
        if (result.rows.length === 0) {
            throw new Error("Transaction not found");
        }

        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

exports.getAllTransactions = async () => {
    const query = `SELECT * FROM transactions ORDER BY created_at DESC`;

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error in getAllTransactions:", error);
        throw error;
    }
};
