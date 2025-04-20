const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).send('Access Denied')
    }

    try {
        const decoded = jwt.verify(token, process.env.jwt)
        req.user = decoded 
        next()
    } catch (error) {
        return res.status(400).send('Invalid Token')
    }
}

module.exports = authenticate
