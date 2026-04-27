const redis = require('./redis')

const rateLimiter = (limit = 1000, window = 60) => async (req, res, next) => {
    try{

        //use the ip address as the key for rate limiting
        const ip = req.ip || req.connection.remoteAddress
        const key = `rate limit:${ip}`

        //get the current count of requests for this key from Redis
        const request = await redis.get(key)
        const currentCount = request ? parseInt(request) : 0


        if (currentCount >= limit) {
            return res.status(429).json({ message: 'Too many requests, please try again later', retryAfter: window 
            })
        }

        if(currentCount === 0) {
            //if this is the first request, set the count to 1 and set the expiration time for the key
            await redis.set(key, 1, { ex: window })
        }
        else {
            //if this is not the first request, increment the count for this key in Redis
            await redis.incr(key)
        }

        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - currentCount - 1))
        res.setHeader('X-RateLimit-Reset', window)

        next()
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

module.exports = rateLimiter