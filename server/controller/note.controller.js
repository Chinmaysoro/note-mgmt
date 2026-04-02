const NoteModel = require("../model/note.model");

const createNote = async (req, resp) => {
    try {
        const { title, content, tags } = req.body;     

        if (!title || !content) return resp.status(400).send({ success: false, msg: "Note title/ content missing..." });

        const newNote = new NoteModel({ title, content, tags: tags.map(t => t.trim().toLowerCase()).filter(Boolean) });
        const response = await newNote.save();
        return resp.status(201).send({ success: true, msg: "Note created successfully!!!", response })
    } catch (error) {
        console.log(error);

        return resp.status(500).send({ success: false, msg: error.message })
    }
};

const updateNote = async (req, resp) => {
    try {
        const { title, content, tags } = req.body;
        const noteId = req.params.id
        const response = await NoteModel.findById(noteId);

        if (!response) return resp.status(404).send({ success: false, msg: "Data not found!" });
        if (title) response.title = title;
        if (content) response.content = content;
        if (tags) response.tags = tags.map(t => t.trim().toLowerCase()).filter(Boolean);

        await response.save();

        return resp.status(200).send({ success: true, msg: "Note Updated successfully!!!" })
    } catch (error) {
        return resp.status(500).send({ success: false, msg: error.message })
    }
}

const deleteNote = async (req, resp) => {
    try {
        const noteId = req.params.id;
        const response = await NoteModel.findByIdAndDelete(noteId);
        if (!response) return resp.status(400).send({ success: false, msg: "Nothing to delete!!!" })
        console.log("response:-", response);


        return resp.status(200).send({ success: true, msg: "Note deleted successfully!!!" })
    } catch (error) {
        return resp.status(500).send({ success: false, msg: error.message })
    }
};

const getNoteById = async (req, resp) => {
    try {
        const noteId = req.params.id
        const response = await NoteModel.findById(noteId);
        if (!response) return resp.status(404).send({ success: false, msg: "No data available!" })

        return resp.status(200).send({ success: true, data: response })
    } catch (error) {
        return resp.status(500).send({ success: false, msg: error.message })
    }
};


const getAllNotes = async (req, resp) => {
    try {
        const { search, tags } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } }
            ];
        };
        if (tags) {
            const tagsArray = tags
                .split(",")
                .map(t => t.trim())
                .filter(Boolean);

            query.tags = { $in: tagsArray };
        }

        console.log(query);

        const response = await NoteModel.find(query).sort({ createdAt: -1 });
        if (!response.length) return resp.status(404).send({ success: false, msg: "No data available!" })

        return resp.status(200).send({ success: true, data: response })
    } catch (error) {
        return resp.status(500).send({ success: false, msg: error.message })
    }
};




module.exports = { createNote, updateNote, deleteNote, getAllNotes, getNoteById }