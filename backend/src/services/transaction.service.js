const prisma = require('../lib/prisma');

// Create a new transaction
const createTransaction = async (data, userId) => {
    return await prisma.transaction.create({
        data: {
            amount: data.amount,
            type: data.type.toUpperCase(),      // normalize to "INCOME" or "EXPENSE"
            category: data.category,
            date: new Date(data.date),
            notes: data.notes || null,
            userId,                                 // taken from JWT token, not request body
        }
    });
};

// Get all transactions with optional filters
const getTransactions = async (filters, userId, userRole) => {
    const where = {
        isDeleted: false,      // never return soft-deleted records
    };

    // ADMIN and ANALYST see all users' transactions
    // VIEWER only sees their own
    if (userRole === 'VIEWER') {
        where.userId = userId;
    }

    // Optional filters from query params
    // e.g. GET /api/transactions?type=INCOME&category=salary&from=2024-01-01&to=2024-12-31
    if (filters.type) where.type = filters.type.toUpperCase();
    if (filters.category) where.category = filters.category;
    if (filters.from || filters.to) {
        where.date = {};
        if (filters.from) where.date.gte = new Date(filters.from);
        if (filters.to) where.date.lte = new Date(filters.to);
    }

    return await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },   // most recent first
        include: {
            user: {
                select: { id: true, name: true, email: true }  // include basic user info
            }
        }
    });
};

// Get a single transaction by ID
const getTransactionById = async (id, userId, userRole) => {
    const transaction = await prisma.transaction.findFirst({
        where: { id, isDeleted: false }
    });

    if (!transaction) {
        const error = new Error('Transaction not found.');
        error.statusCode = 404;
        throw error;
    }

    // VIEWER can only see their own transaction
    if (userRole === 'VIEWER' && transaction.userId !== userId) {
        const error = new Error('Access denied.');
        error.statusCode = 403;
        throw error;
    }

    return transaction;
};

// Update a transaction
const updateTransaction = async (id, data, userId, userRole) => {
    // First check it exists
    await getTransactionById(id, userId, userRole);

    return await prisma.transaction.update({
        where: { id },
        data: {
            ...(data.amount && { amount: data.amount }),
            ...(data.type && { type: data.type.toUpperCase() }),
            ...(data.category && { category: data.category }),
            ...(data.date && { date: new Date(data.date) }),
            ...(data.notes !== undefined && { notes: data.notes }),
        }
    });
};

// Soft delete — marks isDeleted = true instead of removing from DB
const deleteTransaction = async (id) => {
    const transaction = await prisma.transaction.findFirst({
        where: { id, isDeleted: false }
    });

    if (!transaction) {
        const error = new Error('Transaction not found.');
        error.statusCode = 404;
        throw error;
    }

    return await prisma.transaction.update({
        where: { id },
        data: { isDeleted: true }
    });
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};