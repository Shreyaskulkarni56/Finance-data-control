const prisma = require('../lib/prisma');

// Helper: base where clause (excludes soft deleted)
const baseWhere = (userId, userRole) => {
    const where = { isDeleted: false };
    if (userRole === 'VIEWER') where.userId = userId;
    return where;
};

// 1. Overall summary — total income, expenses, net balance
const getSummary = async (userId, userRole) => {
    const transactions = await prisma.transaction.findMany({
        where: baseWhere(userId, userRole)
    });

    const totalIncome = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        totalTransactions: transactions.length
    };
};

// 2. Category wise totals — e.g. { salary: 5000, rent: 1200, food: 450 }
const getCategoryTotals = async (userId, userRole) => {
    const transactions = await prisma.transaction.findMany({
        where: baseWhere(userId, userRole)
    });

    const totals = {};
    for (const t of transactions) {
        if (!totals[t.category]) {
            totals[t.category] = { income: 0, expense: 0 };
        }
        if (t.type === 'INCOME') totals[t.category].income += t.amount;
        if (t.type === 'EXPENSE') totals[t.category].expense += t.amount;
    }

    return totals;
};

// 3. Monthly trends — totals grouped by year-month
// e.g. { "2024-03": { income: 7000, expense: 1500 }, "2024-04": { ... } }
const getMonthlyTrends = async (userId, userRole) => {
    const transactions = await prisma.transaction.findMany({
        where: baseWhere(userId, userRole),
        orderBy: { date: 'asc' }
    });

    const trends = {};
    for (const t of transactions) {
        const month = t.date.toISOString().slice(0, 7); // "2024-03"
        if (!trends[month]) trends[month] = { income: 0, expense: 0 };
        if (t.type === 'INCOME') trends[month].income += t.amount;
        if (t.type === 'EXPENSE') trends[month].expense += t.amount;
    }

    return trends;
};

// 4. Recent activity — last 5 transactions
const getRecentActivity = async (userId, userRole) => {
    return await prisma.transaction.findMany({
        where: baseWhere(userId, userRole),
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
            user: { select: { name: true, email: true } }
        }
    });
};

// 5. Full dashboard — all of the above in one single API call
const getFullDashboard = async (userId, userRole) => {
    const [summary, categoryTotals, monthlyTrends, recentActivity] = await Promise.all([
        getSummary(userId, userRole),
        getCategoryTotals(userId, userRole),
        getMonthlyTrends(userId, userRole),
        getRecentActivity(userId, userRole)
    ]);

    return { summary, categoryTotals, monthlyTrends, recentActivity };
};

module.exports = { getSummary, getCategoryTotals, getMonthlyTrends, getRecentActivity, getFullDashboard };