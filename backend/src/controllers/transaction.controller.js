const transactionService = require('../services/transaction.service');

const createTransaction = async (req, res, next) => {
    try {
        // Pass userRole so service can decide whether to allow userId override
        const transaction = await transactionService.createTransaction(req.body, req.user.id, req.user.role);
        res.status(201).json({ success: true, message: 'Transaction created.', data: transaction });
    } catch (err) { next(err); }
};

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await transactionService.getTransactions(req.query, req.user.id, req.user.role);
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (err) { next(err); }
};

const getTransactionById = async (req, res, next) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: transaction });
    } catch (err) { next(err); }
};

const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await transactionService.updateTransaction(req.params.id, req.body, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Transaction updated.', data: transaction });
    } catch (err) { next(err); }
};

const deleteTransaction = async (req, res, next) => {
    try {
        await transactionService.deleteTransaction(req.params.id);
        res.status(200).json({ success: true, message: 'Transaction deleted.' });
    } catch (err) { next(err); }
};

module.exports = { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };