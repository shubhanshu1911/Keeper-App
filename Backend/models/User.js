const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import the Schema object


const UserSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique: true
    },
    password :{
        type : String,
        required : true
    },
    date :{
        type : Date,
        default : Date.now
    }
});
const User =  mongoose.model('user', UserSchema);
module.exports = User 