const transactionRepository = require("../repository/transaction.repository");
const baseResponse = require("../utils/baseResponse.util"); // Tambahkan ini

exports.createTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepository.createTransaction(req.body);
        res.status(201).json({
            success: true,
            message: "Transaction created",
            payload: transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Error creating transaction",
            payload: null
        });
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const result = await transactionRepository.payTransaction(transactionId);
        res.status(200).json({
            success: true,
            message: "Payment successful",
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to pay",
            payload: null
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id;
        const result = await transactionRepository.deleteTransaction(transactionId);
        res.status(200).json({
            success: true,
            message: "Transaction deleted",
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Transaction not found",
            payload: null
        });
    }
};

exports.getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        return baseResponse(res, true, 200, "List of transactions", transactions); // Gunakan baseResponse
    } catch (error) {
        next(error); // throw ke error handler
    }
};