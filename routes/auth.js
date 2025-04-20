const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
        return res.status(400).send('Invalid credentials')
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(400).send('Invalid credentials')
    }

    const token = jwt.sign({ _id: user._id }, process.env.jwt, { expiresIn: '24h' })

    res.json({ token })
})

module.exports = router