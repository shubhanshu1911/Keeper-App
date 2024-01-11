const mongoose = require('mongoose');

const mongoURL = "mongodb://localhost:27017/?directConnection=true";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("Connected to Mongo Successfully");
    } catch (error) {
        console.error("Error connecting to Mongo:", error.message);
    }
}

module.exports = connectToMongo;
