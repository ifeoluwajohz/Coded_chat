const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Set up CORS to allow requests from your frontend
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

// Serve static files from the "public" directory
app.use(express.static('public'));

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('joinRoom', ({ username, state }) => {
        socket.join(state);

        // Sends a message to everyone in the group except the sender
        socket.to(state).emit('message', { username: 'Admin', message: `${username} has joined ${state}.` });
    });

    socket.on('chatMessage', ({ username, message, state }) => {
        io.to(state).emit('message', { username, message });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);

        // Notify all clients in all rooms that a user has left
        socket.broadcast.emit('message', { username: 'Admin', message: 'A user has disconnected.' });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
