require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.config");
const cors= require("cors")

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const SERVER_PORT = process.env.SERVER_PORT

app.get("/", (req, resp) => {
    resp.status(200).send({ success: true, msg: "Ok" })
});

app.use("/api/v1/notes", require("./router/note.route"))

const initiateConnection = () => {
    connectDB();
    app.listen(SERVER_PORT, () => console.log(`http://127.0.0.1:${SERVER_PORT}`))
}

initiateConnection()