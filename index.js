// const path = require('path');
// const http = require('http')

// const express = require('express')
// const socketio = require('socket.io')
// const app = express();

// const server = http.createServer(app)
// const io = socketio(server)
// const PORT = 3000 || process.env.PORT;
// const formatMessage = require('./utils/message')

// app.use(express.static(path.join(__dirname, 'frontend')));
// const botName = "ChatCord Bot";


// io.on('connection', socket => {
//     console.log('New WS Connection Ife...')

//     socket.emit('message', formatMessage(botName, 'Welcome to ChatCord'))
    
//     socket.broadcast.emit('message', formatMessage(botName, 'A User has joined the chat'))

//     socket.on('disconnect', () => {
//         io.emit('message', formatMessage(botName, 'A user has left the chat'))
//     })

//     socket.on('chatMessage', msg => {
//         io.emit('message', formatMessage('User', msg))
//     })
// })

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // Serve static files

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinRoom', ({ username, room }) => {
        socket.join(room);
        socket.to(room).emit('message', `${username} has joined the room`);
    });

    socket.on('chatMessage', ({ username, room, message }) => {
        io.to(room).emit('message', `${username}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
