const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
// bcrypt is a authentiction method which help in genrating hash and salt
const bcrypt = require('bcryptjs');

var fetchuser = require('../middleware/fetchuser');

// jsonwebtoken is a security layer between client and server which provides token to the client
const jwt = require('jsonwebtoken');
const JWT_SECRET = "shubhanshu@iiitdm";

// TODO 1: Create a User using : POST "/api/auth/createuser". Doesn't require auth
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

            // Using bcrypt and returns promises 
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            // Valid input
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });
            
            const data = {
                user : {
                    id : user.id
                }
            }

            const authToken = jwt.sign(data,JWT_SECRET)
            res.json({authToken});
        } catch (error) {
            // Other errors
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// TODO 2 : Authenticate a User using : POST "/api/auth/login". No login required
router.post(
    '/login',
    [
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Password cannot be blank').exists()
    ],
    async (req, res) => {

        const error = validationResult(req);

        if (!error.isEmpty()) {
        // Validation errors
        return res.status.json({ errors: error.array() });
        }
        
        const {email, password} = req.body;
        try {
            // Try to find the user with the current Email id
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({error : "Please try o login with correct credentials"});
            }
            
            // Compare the password 
            const comparePass = await bcrypt.compare(password, user.password);
            if(!comparePass){
                return res.status(400).json({error : "Please try to login with correct credentials"});
            }

            const data = {
                user : {
                    id : user.id
                }
            }

            const authToken = jwt.sign(data,JWT_SECRET)
            res.json({authToken});

        }catch(error){
            // Other errors
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
)

// TODO 3 : Get loggin user Details using : POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async(req,res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    }catch(error){
       // Other errors
       console.error('Error creating user:', error);
       res.status(500).send('Internal Server Error'); 
    }
})
module.exports = router;
