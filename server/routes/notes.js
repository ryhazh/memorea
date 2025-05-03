const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const authenticate = require('../middleware/authMiddleware')

router.get('/', authenticate, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user._id })
        res.json(notes)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getNote, authenticate, checkOwnership, async (req, res) => {
    res.json({ data: res.note })
})

router.post('/', authenticate, async (req, res) => {
    const note = new Note({
        userId: req.user._id,
        title: req.body.title,
        content: req.body.content
    })

    try {
        const newNote = await note.save()
        res.status(201).json({ message: "note successfully created", data: newNote })
    } catch (err) {
        res.json({ message: err.message })
    }
})

router.patch('/:id', getNote, authenticate, checkOwnership, async (req, res) => {

    if (req.body.title != null) {
        res.note.title = req.body.title
    }
    

    if (req.body.content != null) {
        res.note.content = req.body.content
    }

    try {
        const updatedNote = await res.note.save()
        res.status(201).json({ message: "successfully updated the note" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', getNote, authenticate, checkOwnership, async (req, res) => {
    try {
        await res.note.deleteOne()
        res.status(202).json({ message: "note deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getNote(req, res, next) {
    let note
    try {
        note = await Note.findById(req.params.id)
        if (note == null) {
            return res.status(404).json({ message: "note not found" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.note = note
    next()

}

async function checkOwnership(req, res, next) {
    try {
        if (res.note.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send("You don't have permission to perform this action.")
        }
        next()
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports = router