var app = require('http').createServer();
const PORT = process.env.PORT || 3231;
var io = module.exports.io = require('socket.io')(app, {
  cors: {
    origin: `http://localhost:${PORT}`,
    methods: ["GET", "POST"]
  }
});


const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
