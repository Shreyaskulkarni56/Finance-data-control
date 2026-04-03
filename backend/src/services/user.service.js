const prisma = require('../lib/prisma');

// Get all users — ADMIN only
const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            // never return password field
        }
    });
};

// Get single user by ID
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
    });

    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }

    return user;
};

// Update user role — ADMIN only
const updateUserRole = async (id, role) => {
    const validRoles = ['VIEWER', 'ANALYST', 'ADMIN'];
    if (!validRoles.includes(role)) {
        const error = new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }

    await getUserById(id); // check user exists first

    return await prisma.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true }
    });
};

// Activate or deactivate a user — ADMIN only
const updateUserStatus = async (id, isActive) => {
    await getUserById(id); // check user exists first

    return await prisma.user.update({
        where: { id },
        data: { isActive },
        select: { id: true, name: true, email: true, isActive: true }
    });
};

module.exports = { getAllUsers, getUserById, updateUserRole, updateUserStatus };