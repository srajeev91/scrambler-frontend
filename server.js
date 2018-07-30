// Dependencies
const express = require('express');
var socket = require('socket.io');
var app = express();
var path = require("path");

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'src/index.js'));
// });

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname+'/public/index.html'));
// })

// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', function (req, res) { res.redirect('/index.html') });

// Starts the server.
let server = app.listen(5000, function() {
  console.log('Server running on port 5000');
});

var io = socket(server);


io.on('connection', (socket) => {
    //console.log('client connected');
    console.log(socket.id)
});
