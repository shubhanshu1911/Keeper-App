const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    const obj = {
        name : 'SHubhanshu',
        number : 34
    }
    res.json(obj)
})

module.exports = router