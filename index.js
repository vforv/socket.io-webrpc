const express = require('express');
const app = new express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors')

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.redirect('index.html');
});

io.origins('*:*');

io.on('connection', function (socket) {
    socket.on('stream', function (image) {
        socket.broadcast.emit('stream', image);
    })
})

http.listen(port, function () {
    console.log('Server started!')
});