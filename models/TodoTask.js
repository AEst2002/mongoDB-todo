// schema for task that gets used as a document in our db
// #Schema - This model outlines what gets stored in our db, with
// different fields and specifications about their type, default value, etc.
const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);