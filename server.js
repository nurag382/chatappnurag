// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use(express.json()); // For parsing JSON bodies
app.use(session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: false,
    saveUninitialized: true
}));

app.post('/login', (req, res) => {
    req.session.username = req.body.username;
    res.json({ success: true });
});

app.get('/username', (req, res) => {
    res.json({ username: req.session.username });
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Retrieve and set the username for the socket
    socket.on('set username', (username) => {
        socket.username = username;
    });

    // Handle incoming chat messages
    socket.on('chat message', (msg) => {
        io.emit('chat message', { username: socket.username, message: msg });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
