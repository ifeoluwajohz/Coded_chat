const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load .env file

const app = express();
const server = http.createServer(app);

// Determine the environment (development or production)
const isProduction = process.env.NODE_ENV === 'production';

// Set up CORS for Express and Socket.IO
const corsOptions = {
    origin: isProduction
        ? [process.env.PRODUCTION_FRONTEND_URL]
        : [process.env.DEVELOPMENT_FRONTEND_URL],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true // Optional: if you need to support cookies or other credentials
};

app.use(cors(corsOptions));

// Serve static files from the "public" or "build" directory
const staticDir = isProduction ? 'public' : 'build';
app.use(express.static(path.join(__dirname, staticDir)));

// Set up Socket.IO with CORS
const io = new Server(server, {
    cors: corsOptions
});

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

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
