const express = require('express')
const router = express.Router()
const Note = require('../models/Note')

router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({userId: req.query.userId})
        res.json(notes)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getNote, async (req, res) => {
    res.json({ data: res.note })
})

router.post('/', async (req, res) => {
    const note = new Note({
        userId: req.body.userId,
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

router.patch('/:id', getNote, async (req, res) => {
    if (req.body.userId != null) {
        res.note.userId = req.body.userId
    }
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

router.delete('/:id', getNote, async (req, res) => {
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

module.exports = router