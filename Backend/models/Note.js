const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    // Linking user with notes using a forgein key(user id)
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    title :{
        type : String,
        required : true
    },
    description :{
        type : String,
        required : true,
    },
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Note', NotesSchema);