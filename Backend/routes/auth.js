const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create a User using : POST "/api/auth/createuser". Doesn't require auth
router.post(
    '/createuser',
    [
        body('name', 'Enter a valid Name').isLength({ min: 3 }),
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const error = validationResult(req);

            if (!error.isEmpty()) {
                // Validation errors
                return res.status.json({ errors: error.array() });
            }

            // Checking for the duplication Email id of a user 
            let user = await User.findOne({emial : req.body.email});
            if(user){
                return res.status(400).json({error : "Sorry, Email is already registered."})
            }

            // Valid input
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            res.json(user);
        } catch (error) {
            // Other errors
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;
