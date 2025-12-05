import z from 'zod';

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});


const registerSchema = loginSchema;

function validationMiddleware(schema) {
    return (req, res, next) => {
        const data = req.body;
        const result = schema.safeParse(data);
        
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation error',
                details: result.error.errors
            });
            return;
        }

        req.playload = result.data;
        return next();
    };
}

export { validationMiddleware, loginSchema, registerSchema };