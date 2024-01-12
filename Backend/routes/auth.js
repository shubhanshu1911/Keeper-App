const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Create a User using : POST "/api/auth/". Doesn't require auth
router.post(
    '/',
    [
        body('name', 'Enter a valid Name').isLength({ min: 3 }),
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                // Validation errors
                return res.send({ errors: result.array() });
            }

            // Valid input
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            res.json(user);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
                // Duplicate key error for email
                return res.status(400).json({ errors: [{ msg: 'Email is already registered.' }] });
            }

            // Other errors
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

module.exports = router;
