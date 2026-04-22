const validate = (schema) => (req, res, next) => {
    
    try{
        const result = schema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                message: 'Validation type error',
                errors: result.error.errors
            })
        }
        req.body = result.data
        next()
    }
    catch (error) {
        res.status(400).json({ message: 'Validation something error', errors: error.message })
    }
}

module.exports = validate