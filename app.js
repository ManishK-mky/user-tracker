const express = require('express');
const app = express();
const http = require('http'); // require 'http' module explicitly
const path = require('path');
const socketIo = require('socket.io'); // require 'socket.io' module explicitly

const port = 3000;

// --------- Socket.io Setup ----------
const server = http.createServer(app); // create a HTTP server using express app
const io = socketIo(server); // attach Socket.io to the HTTP server

// ---------- EJS Setup ---------------
app.set('view engine', 'ejs');

// --------- Static Folder Setup --------
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Routes Setup --------------
const mapRoute = require('./routes/mapRoute');
app.use('/', mapRoute);


// --------- Socket.io Connection -------
// io.on() checks for the connection 
io.on('connection', (socket) => {

    //for receiving the events from the frontned part --> socket.on()
    socket.on("send-location" , function(data){
        io.emit("receive-location" , {id : socket.id , ...data}) //sending that we receive the event send by frontend
    })
    console.log('a user connected', socket.id);

    socket.on("disconnect" , function(){
        io.emit("user-disconnected" , socket.id)
    })
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
