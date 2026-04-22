const { z } = require("zod")

const registerSchema = z.object({
    username: z.string().min(6).max(100).toLowerCase(),
    email: z.string('must required @').email().toLowerCase(),
    password: z.string().min(8).max(64)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(64)
})

module.exports = {
    registerSchema,
    loginSchema
}