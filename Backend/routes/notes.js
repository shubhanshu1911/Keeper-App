const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');

// TODO 1: Get All the Notes using: GET "api/notes/fetchallnotes". login required
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

// TODO 2: Add a new Note using: POST "api/notes/addnote". login required
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter Title').isLength({ min: 3 }),
        body('description', 'description must be at least 5 characters').isLength({ min: 5 })
    ], async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // If there are errors, return bad request
            const error = validationResult(req);
            if (!error.isEmpty()) {
                // Validation errors
                return res.status.json({ errors: error.array() });
            }

            const note = new Note({
                title, description,tag, user: req.user.id
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

// TODO 3: Update an existing Note using: PUT "api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
        const {title, description, tag} = req.body;

        try {
            // Create a new notes object
            const newNote = {};
            if(title){newNote.title = title};
            if(description){newNote.description = description};
            if(tag){newNote.tag = tag};

            // Find the note to be updated and update it
            var note = await Note.findById(req.params.id);
            if(!note) {
            return res.status(404).send("Not Found")
            }

            // note.user.toString() will give me that note id
            if(note.user.toString() !== req.user.id){
                return res.status(401).send("Not Allowed")
            }

            note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new : true})
            res.json({note});
        } catch (error) {
            // Other errors
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
        
    }
)

// TODO 4: Delete an existing Note using: DELETE "api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted and delete it
        var note = await Note.findById(req.params.id);
        if(!note) {
        return res.status(404).send("Not Found")
        }

        // note.user.toString() will give me that note id
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed")
        }

        // Allow deletion only if user wons this note
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success" : "Note has been deleted", note : note});
    } catch (error) {
        // Other errors
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
    
}
)
module.exports = router