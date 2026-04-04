// validate.js — reusable validation middleware using Zod
// Usage: router.post('/', validate(schema), controller)

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Extract clean error messages from Zod's error format
        const errors = result.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed.',
            errors
        });
    }

    // Replace req.body with the validated + cleaned data
    req.body = result.data;
    next();
};

module.exports = validate;