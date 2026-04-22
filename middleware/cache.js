const redis = require('./redis')

const cacheMiddleware = (key, expireTime = 60) => async (req, res, next) => {
    try {
        const cachedData = await redis.get(key)

        if (cachedData) {
            return res.status(200).json({
                fromcache: true,
                message: 'Data retrieved from cache',
                data: JSON.parse(cachedData)
            })
        }
        res.sendResponse = res.json

        res.json = async (data) => {
            await redis.set(key, JSON.stringify(data), { ex: expireTime })
            res.sendResponse(data)
        }
        next()
        }
        catch (error) {
        res.status(500).json({ message: 'Server error' })
        }
}

module.exports = cacheMiddleware