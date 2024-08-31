const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080'] // Update with your frontend URL
    }
});

io.on("connection", socket => {
    console.log(`${socket.id} connected`);

    socket.on('joinRoom', ({ username, state }) => {
        socket.join(state);

        //sends  message to everyone in the group except the sender
        socket.to(state).emit('message', { username: 'Admin', message: `${username} has joined ${state}.` });

    });

    socket.on('chatMessage', ({ username, message, state}) => {
        io.to(state).emit('message', { username, message });
    });

    socket.on('disconnect', ({ username, state }) => {
        console.log(`${socket.id} disconnected`);

        // Notify all clients in all rooms that a user has left
        socket.to(state).emit('message', { username: 'Admin', message: `${username} has joined the room.` });
    });
});


// io.on('connection', socket => {
//     console.log('New user connected:', socket.id);

//     // Join a room
//     socket.on('joinRoom', ({ username, room }) => {
//         socket.join(room);
//         socket.username = username;
//     });

//     // Handle chat messages
//     socket.on('chatMessage', ({ room, message }) => {
//         io.to(room).emit('message', { username: socket.username, message });
//     });

//     // Handle private messages
//     socket.on('privateMessage', ({ recipient, message }) => {
//         const recipientSocket = Array.from(io.sockets.sockets).find(([id, s]) => s.username === recipient);

//         if (recipientSocket) {
//             const recipientSocketId = recipientSocket[0];
//             io.to(recipientSocketId).emit('message', { username: socket.username, message });
//         } else {
//             socket.emit('message', { username: 'System', message: `User ${recipient} is not online.` });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });