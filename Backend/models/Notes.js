const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Import the Schema object


const NotesSchema = new Schema({
    title :{
        type : String,
        required : true
    },
    content :{
        type : String,
        required : true,
    },
});

module.exports = mongoose.model('Note', NotesSchema);