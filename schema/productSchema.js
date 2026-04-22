const { z } = require('zod')

const createSchema = z.object({
    brand: z.string().min(1).max(100),
    quantity: z.string(),
    category: z.string(),
    supplies: z.string().min(1)
})

const updateSchema = z.object({
    brand: z.string().min(1).max(100).optional(),
    quantity: z.string().optional(),
    category: z.string().optional(),
    supplies: z.string().min(1)
})

module.exports = {
    createSchema,
    updateSchema
}