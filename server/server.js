const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

let availableRoom = null;
const rooms = {}; // To store rooms and users
const userNames = {}; // To store users' actual names


io.on('connection', (socket) => {
    
    socket.on('joinRoom', (userName) => {
        if (!availableRoom || rooms[availableRoom].length === 2) {
            // Create a new room if none available or full
            availableRoom = `room${Object.keys(rooms).length + 1}`;
            rooms[availableRoom] = []; // Create a new room with an empty user list
        }
    
        // Store the user's name and add them to the room
        userNames[socket.id] = userName;
        rooms[availableRoom].push(socket.id);
        socket.join(availableRoom); // Join the room
    
        console.log(`User ${userName} joined room: ${availableRoom}, total users: ${rooms[availableRoom].length}`);
    
        // If two users have joined, start the game
        if (rooms[availableRoom].length === 2) {
            io.to(availableRoom).emit('startGame', {
                names: rooms[availableRoom].map(id => userNames[id]), // Send both users' names
                roomId: availableRoom // Send back the room ID
            });
            console.log(`Game started in room: ${availableRoom}`);
        }
    });
    
    // Handle when one user correctly guesses the other user's name
    socket.on('correctGuess', (roomId, hintWord) => {
        socket.to(roomId).emit('receiveHint', hintWord); // Send a hint to the other user
    });

    socket.on('sendMessage', ({ message, roomId }) => {
        console.log(`Message sent to room ${roomId}:`, message); // Log the message being sent
        socket.to(roomId).emit('receiveMessage', message); // Emit to the other user in the room
    });

    socket.on('disconnect', () => {
        // Remove user from rooms and delete the room if empty
        for (let roomName in rooms) {
            rooms[roomName] = rooms[roomName].filter(userId => userId !== socket.id);
            if (rooms[roomName].length === 0) {
                delete rooms[roomName];
                console.log(`Room ${roomName} is now empty and deleted.`);
            }
        }
        console.log('A user disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
