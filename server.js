const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:8080'], // Update with your frontend URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
});

app.use(cors({
    origin: 'http://localhost:8080', // Update with your frontend URL
    methods: ['GET', 'POST'],
}));

// Serve static files from Snowpack's build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle socket.io connections
io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('joinRoom', ({ username, state }) => {
        socket.join(state);
        socket.to(state).emit('message', { username: 'Admin', message: `${username} has joined ${state}.` });
    });

    socket.on('chatMessage', ({ username, message, state }) => {
        io.to(state).emit('message', { username, message });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        socket.broadcast.emit('message', { username: 'Admin', message: 'A user has disconnected.' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
