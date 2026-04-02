const express = require("express");
const { createNote, updateNote, deleteNote, getAllNotes, getNoteById } = require("../controller/note.controller");

const router = express.Router();

router.route("/")
    .get(getAllNotes)
    .post(createNote)


router.route("/:id")
    .get(getNoteById)
    .patch(updateNote)
    .delete(deleteNote)
module.exports = router;