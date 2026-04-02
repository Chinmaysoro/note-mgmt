const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String]

}, {
    timestamps: true
})

// const NoteModel = mongoose.model('Note', NoteSchema);
module.exports = mongoose.model('Note', NoteSchema);