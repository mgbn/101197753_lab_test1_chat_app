var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var cors = require('cors')
const path = require('path')

const userRouter = require('./routes/UserRoutes')
const groupMessageRouter = require('./routes/GroupMessageRoutes')
const privateMessageRouter = require('./routes/PrivateMessageRoutes')

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, '/')))
app.use(cors())
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


app.get("/", (req, res) => {
  res.send("Chat Server running...")
})

app.get("/index.html", (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


//Declare MongoDB Schemas
var Message = mongoose.model('Message', {
  username: String,
  message: String,
  room: String
})



var dbUrl = 'mongodb+srv://Mustafa:m1g2b3n4@cluster0.zf9udrk.mongodb.net/Chat?retryWrites=true&w=majority'

var message;

app.post('/messages', (req, res) => {

  message = new Message(req.body);

  message.save((err) => {
    if (err) {
      console.log(err)
    }

    res.sendStatus(200);
  })
})


app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  })
})


const users = [];

io.on('connection', (socket) => {

  console.log(`User Connected: ${socket.id}`)


  socket.emit("situation", ({ username: '', message: `Welcome` }))

  socket.broadcast.emit("joinRoom", ({ username: `User Connected: ${users[0]}`, message: '' }))



  //Get chat message
  socket.on('userInfo', ({ username, room, message }) => {
    users.push(username)

    socket.join(room)

    socket.broadcast.to(room).emit("joinRoom", ({ username, room, message }))

    socket.emit("joinRoom", ({ username, room, message }))


  });

  socket.on("disconnect", () => {
    io.emit("situation", ({ username: '', message: `A user Left` }))
  })

})







mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('mongodb connected', err);
  } else {
    console.log('Successfully mongodb connected');
  }
})



app.use(userRouter);
app.use(groupMessageRouter);
app.use(privateMessageRouter);

server.listen(3001, () => {
  console.log('server is running on port', server.address().port);
});


