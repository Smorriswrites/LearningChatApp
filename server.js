var express = require("express")
var mongoose = require("mongoose")
var bodyParser = require("body-parser")

var app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var conString = "mongodb+srv://REDACTED"
app.use(express.static(__dirname))

var chatsSchema = new mongoose.Schema({
    name: String,
    chat: String
})

var Chats = mongoose.model("Chats", chatsSchema, "Chats")

mongoose.connect(conString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

.then(() => {
    console.log("MongoDB Connected")
})

.catch(err => console.log(err))

var http = require('http').createServer(app)
var io = require('socket.io')(http)

io.on("connection", (socket) => {
    console.log("Socket is connected...")
    socket.on('chat', (msg) => {
        io.emit('chat', msg)
    })
})

var server = http.listen(8080, '10.1.1.38', () => {
    console.log(server.address().address)
    console.log(server.address().port)
    console.log("Well done, now I am listening on ", server.address().port)
})

app.post("/chats", (req, res) => {
    var chat = new Chats(req.body)
    chat.save()
        .then(item => {
            res.send("item saved to db")
            console.log(item + " saved to db")
        })
        .catch(err => {
            res.status(400).send("unable to save to db")
            console.log(err)
        })
})

app.get("/chats", (req, res) => {
    Chats.find({}, (error, chats) => {
        res.send(chats)
    })
})