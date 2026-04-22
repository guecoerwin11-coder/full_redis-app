require('dotenv').config()
const express = require('express')
const connectDB = require('./database')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const uploadRoutes = require('./routes/upload')
const ratelimit = require('./middleware/rateLimiter')

const app = express()

// Connect to MongoDB
connectDB()

app.use(ratelimit(10, 60)) // Limit to 10 requests per minute

// Middleware
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)

// Start the server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})
