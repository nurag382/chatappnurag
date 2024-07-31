// public/script.js

const socket = io();

// Retrieve the username from the session
fetch('/username')
    .then(response => response.json())
    .then(data => {
        const username = data.username;
        socket.emit('set username', username);
        document.getElementById('username-display').textContent = `Logged in as: ${username}`;
    });

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (data) => {
    const { username, message } = data;
    const item = document.createElement('li');
    
    // Create a message container
    const messageContainer = document.createElement('div');
    messageContainer.className = username === socket.username ? 'message-self' : 'message-other';
    
    // Create a username element
    const usernameElement = document.createElement('div');
    usernameElement.className = 'message-username';
    usernameElement.textContent = username;
    
    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.className = 'message-text';
    messageElement.textContent = message;
    
    // Append username and message to the container
    messageContainer.appendChild(usernameElement);
    messageContainer.appendChild(messageElement);
    
    // Append container to the messages list
    item.appendChild(messageContainer);
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll to the bottom
});
