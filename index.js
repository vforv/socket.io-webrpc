const express = require('express');
const fs = require('fs');
const app = new express();
const options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
};
const https = require('https').createServer(options, app);

const http = require('http').Server(app);

let io = require('socket.io')(https);

if (process.env.PORT) {
    io = require('socket.io')(http);
}


const port = process.env.PORT || 443;


app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.redirect('index.html');
});

io.origins('*:*');

io.on('connection', function (socket) {
    socket.on('stream', function (image) {
        socket.broadcast.emit('stream', image);
    })

    socket.on('answer-r', function (image) {
        socket.broadcast.emit('answer-e', image);
    })

    socket.on('candidate', function (message) {
        socket.broadcast.emit('candidate', message);
    });

})


if (!process.env.PORT) {
    https.listen(port, function () {
        console.log('Server started!')
    });
} else {
    http.listen(port, function () {
        console.log('Server started!')
    });
}
