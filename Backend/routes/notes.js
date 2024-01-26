const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

// TODO 1: Get All the Notes using: GET "api/auth/fetchallnotes". login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        // Other errors
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }

})

// TODO 2: Add a new Note using: POST "api/auth/addnote". login required
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter Title').isLength({ min: 3 }),
        body('description', 'description must be at least 5 characters').isLength({ min: 5 })
    ], async (req, res) => {
        try {
            const { title, description } = req.body;

            // If there are errors, return bad request
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Validation errors
                return res.status.json({ errors: error.array() });
            }

            const note = new Note({
                title, description, user: req.user.id
            })

            const savedNote = await note.save();
            res.json(savedNote);

        } catch (error) {
            // Other errors
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }

)
module.exports = router