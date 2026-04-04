const { z } = require('zod');

const createTransactionSchema = z.object({
    amount: z.number().positive('Amount must be a positive number.'),
    type: z.enum(['INCOME', 'EXPENSE'], { message: 'Type must be INCOME or EXPENSE.' }),
    category: z.string().min(1, 'Category is required.'),
    date: z.string().refine(d => !isNaN(Date.parse(d)), 'Invalid date format.'),
    notes: z.string().optional()
});

const updateTransactionSchema = z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(1).optional(),
    date: z.string().refine(d => !isNaN(Date.parse(d)), 'Invalid date format.').optional(),
    notes: z.string().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update.'
});

module.exports = { createTransactionSchema, updateTransactionSchema };