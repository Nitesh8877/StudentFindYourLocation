const express = require('express')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
const server = http.Server(app)
const routes = require("./routes")
const { setupWebsocket } = require("./websocket")
setupWebsocket(server)

mongoose.connect("mongodb://127.0.0.1:27017/students-as-range");
app.use(express.json());
const db = mongoose.connection
db.on("error", () => console.log("Can't connect to DB"));
db.once("open", () => {
    console.log("Connected to mongo DB");
})

app.use(routes)

server.listen(5500,
    () => console.log("Listening to localhost:5500"))