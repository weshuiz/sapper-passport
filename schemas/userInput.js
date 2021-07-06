import joi from 'joi'// used for validation

// base input validation schema
const baseSchema = joi.object({
    _csrf: joi.string()
});

//append login Schema to base schema
export const loginSchema = baseSchema.append({
    email: joi.string()
        .email(),
    password: joi.string()
        .min(8)
})

//append register Schema to base schema
export const registerSchema = baseSchema.append({
    name: joi.string()
        .min(2),
    lastName: joi.string()
        .min(2),
    email: joi.string()
        .email(),
    password: joi.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
        .messages({
            'string.pattern.base': '"password" must be at least 8 characters long, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special charact'

        }),
    repeat: joi.any().equal(joi.ref('password'))
        .messages({
            'any.only': '"repeat password" does not match "password"'
        })
})

//update for regular users
export const updateSchema = baseSchema.append({
    name: joi.string()
        .min(2),
    lastName: joi.string()
        .min(2),
    email: joi.string()
        .email(),
    password: joi.string()
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)
        .messages({
            'string.pattern.base': '"password" must be at least 8 characters long, 1 Uppercase, 1 Lowercase, 1 Number, 1 Special charact'
        }),
    updatedAt: joi.string(),
    updatedBy: joi.string(),
})

// update schema + roles
export const adminSchema = updateSchema.append({
    roles: joi.array()
})