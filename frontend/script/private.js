import { io } from 'socket.io-client';


document.addEventListener('DOMContentLoaded', function() {
    // Existing variables and socket connection...
    
    const privateMessageForm = document.getElementById('privateMessageForm');
    const privateMessageInput = document.getElementById('privateMessageInput');
    const privateMessagesContainer = document.getElementById('privateMessages');
    let selectedUser = null;

    const socket = io('http://localhost:3000');


    // Handle form submission for private messages
    privateMessageForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const message = privateMessageInput.value.trim();
        if (message && selectedUser) {
            socket.emit('privateMessage', { recipient: selectedUser, message });
            displayPrivateMessage('You', message);
            privateMessageInput.value = '';
        }
    });

    // Listen for incoming private messages from the server
    socket.on('message', function(data) {
        displayPrivateMessage(data.username, data.message);
    });

    // Function to display private messages
    function displayPrivateMessage(username, message) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${username}</strong>: ${message}`;
        privateMessagesContainer.appendChild(messageElement);
        privateMessagesContainer.scrollTop = privateMessagesContainer.scrollHeight;
    }

    // Function to select a user for private chat
    function selectUser(username) {
        selectedUser = username;
        privateMessageForm.style.display = 'block'; // Show private message form
    }

    // Example: Update user list and add event listeners to select users
    socket.on('userList', function(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = ''; // Clear the existing user list

        users.forEach(user => {
            if (user !== socket.username) { // Don't list yourself
                const userElement = document.createElement('div');
                userElement.textContent = user;
                userElement.addEventListener('click', () => selectUser(user));
                userList.appendChild(userElement);
            }
        });
    });

    // Request an updated user list on connection
    socket.emit('getUserList');
});
