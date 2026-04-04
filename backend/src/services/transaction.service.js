const prisma = require('../lib/prisma');

// Create a new transaction
const createTransaction = async (data, userId, userRole) => {
    // ADMIN can assign a transaction to another user by passing userId in request body
    // ANALYST always creates transactions for themselves
    console.log("data.userId:", data.userId);
    console.log("createTransaction called with:", { data, userId, userRole });
    const targetUserId = (userRole === 'ADMIN' && data.userId) ? data.userId : userId;
    console.log("targetUserId:", targetUserId);

    return await prisma.transaction.create({
        data: {
            amount: data.amount,
            type: data.type.toUpperCase(),
            category: data.category,
            date: new Date(data.date),
            notes: data.notes || null,
            userId: targetUserId,
        }
    });
};

// Get all transactions with optional filters
const getTransactions = async (filters, userId, userRole) => {
    const where = {
        isDeleted: false,
    };

    // ADMIN and ANALYST see all users' transactions
    // VIEWER only sees their own
    if (userRole === 'VIEWER') {
        where.userId = userId;
    }
    if (filters.type) where.type = filters.type.toUpperCase();
    if (filters.category) where.category = filters.category;
    if (filters.from || filters.to) {
        where.date = {};
        if (filters.from) where.date.gte = new Date(filters.from);
        if (filters.to) where.date.lte = new Date(filters.to);
    }

    return await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
            user: {
                select: { id: true, name: true, email: true }
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

    if (userRole === 'VIEWER' && transaction.userId !== userId) {
        const error = new Error('Access denied.');
        error.statusCode = 403;
        throw error;
    }

    return transaction;
};

// Update a transaction
const updateTransaction = async (id, data, userId, userRole) => {
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