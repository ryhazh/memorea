const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ data: users })
    } catch (err) {
        res.json(err.message)
    }
})

router.get('/:id', getUser, (req, res) => {
    try {
        res.json({ data: res.user })
    } catch (err) {
        res.json({ message: err.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});


router.patch('/:id', getUser, async (req, res) => {
    const validation = ['email', 'username', 'password'];

    for (const field of validation) {
        if (req.body[field] != null) {
            if (field === 'password') {
                const hashed = await bcrypt.hash(req.body.password, 10);
                res.user.password = hashed;
            } else {
                res.user[field] = req.body[field];
            }
        }
    }

    try {
        const updatedUser = await res.user.save();
        res.status(201).json({ message: 'updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', getUser, async (req, res) => {
    try {
        await res.user.deleteOne()
        res.status(202).json({message: "deleted sucsessfully"})
    } catch (err) {
        res.json({message: err.message})
    }
})


async function getUser(req, res, next) {
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: "user not found" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.user = user
    next()
}


module.exports = router