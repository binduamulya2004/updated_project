

const express = require('express');
// const WebSocket = require('ws');
const dotenv = require('dotenv');
const morgan = require('morgan');
const responseTime = require('express-response-time');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const sharp = require('sharp');
const { decryptMiddleware, encryptMiddleware } = require('./middleware/jwt/cryptoMiddleware');
const { swaggerUi, swaggerSpec } = require('./config/swaggerConfig');

const rateLimit = require('express-rate-limit'); 
const { processPendingFiles } = require('./cronJobs');
const cron = require('node-cron');

const { createServer } = require("http");
const { Server } = require("socket.io");


dotenv.config();
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
 });
const activeUsers = new Map(); // Store active users with their socket IDs
const rooms = new Map(); // Store chat rooms and their members
 
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
 
  // Handle socket errors
  socket.on('error', (error) => {
    socketErrorHandler(socket, error);
  });
 
  // Handle user joining
  socket.on('join', (userData) => {
    console.log('User joined:', userData);
    // Add socket.id to the user data

    const userWithId = { ...userData, id: socket.id };
    activeUsers.set(socket.id, userWithId);
    console.log(activeUsers);
    // Broadcast updated user list to all clients
    io.emit('users', Array.from(activeUsers.values()));
  });
 
  // Handle private messages
  socket.on('private-message', ({ to, message }) => {
    const sender = activeUsers.get(socket.id);
    if (sender && to) {
      const messageData = {
        text: message,
        sender: { ...sender, id: socket.id },
        timestamp: new Date(),
        type: 'private'
      };
     
      // Send to recipient
      socket.to(to).emit('private-message', messageData);
      // Send back to sender
      socket.emit('private-message', messageData);
     
      console.log('Private message sent:', {
        from: sender.username,
        to: to,
        message: messageData
      });
    }
  });
 
  // Handle group chat functionality
  socket.on('create-room', (roomName) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      socket.join(roomName);
      if (!rooms.has(roomName)) {
        rooms.set(roomName, [user]);
      } else {
        // Check if user is not already in the room
        const roomUsers = rooms.get(roomName);
        if (!roomUsers.some(u => u.id === user.id)) {
          roomUsers.push(user);
        }
      }
      io.emit('room-list', Array.from(rooms.keys()));
      io.to(roomName).emit('room-users', {
        room: roomName,
        users: rooms.get(roomName)
      });
    }
  });
 
  socket.on('join-room', (roomName) => {
    const user = activeUsers.get(socket.id);
    if (user && rooms.has(roomName)) {
      socket.join(roomName);
      // Check if user is not already in the room
      const roomUsers = rooms.get(roomName);
      if (!roomUsers.some(u => u.id === user.id)) {
        roomUsers.push(user);
      }
      io.to(roomName).emit('room-users', {
        room: roomName,
        users: rooms.get(roomName)
      });
    }
  });
 
  socket.on('leave-room', (roomName) => {
    const user = activeUsers.get(socket.id);
    if (user && rooms.has(roomName)) {
      socket.leave(roomName);
      // Remove user from room
      const roomUsers = rooms.get(roomName);
      rooms.set(roomName, roomUsers.filter(u => u.id !== user.id));
     
      // Delete room if empty
      if (rooms.get(roomName).length === 0) {
        rooms.delete(roomName);
        io.emit('room-list', Array.from(rooms.keys()));
      } else {
        io.to(roomName).emit('room-users', {
          room: roomName,
          users: rooms.get(roomName)
        });
      }
    }
  });
 
  socket.on('group-message', ({ room, message }) => {
    const sender = activeUsers.get(socket.id);
    if (sender && rooms.has(room)) {
      const messageData = {
        text: message,
        sender: {
          id: socket.id,
          username: sender.username
        },
        timestamp: new Date().toISOString(),  // Use ISO string for consistent timestamp
        messageId: `${socket.id}_${Date.now()}`,  // Add unique message ID
        type: 'group',
        room: room
      };
     
      // Send to all users in the room including sender
      io.in(room).emit('group-message', messageData);
     
      console.log('Group message sent:', {
        room: room,
        from: sender.username,
        message: messageData
      });
    }
  });
 
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const user = activeUsers.get(socket.id);
   
    if (user) {
      // Remove user from all rooms
      rooms.forEach((users, roomName) => {
        rooms.set(roomName, users.filter(u => u.id !== user.id));
        if (rooms.get(roomName).length === 0) {
          rooms.delete(roomName);
        } else {
          io.to(roomName).emit('room-users', {
            room: roomName,
            users: rooms.get(roomName)
          });
        }
      });
     
      // Remove user from active users
      activeUsers.delete(socket.id);
     
      // Broadcast updated lists
      io.emit('users', Array.from(activeUsers.values()));
      io.emit('room-list', Array.from(rooms.keys()));
    }
  });
});







// Set up rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

// Apply the rate limiter to all API routes
app.use('/api', apiLimiter);  // Apply rate limiting only to the /api routes
//429 Too Many Requests



// // WebSocket server -- Server is a class
// const wss = new WebSocket.Server({ noServer: true });//option indicates that the WebSocket server won't create its own HTTP server to listen for connections.

// const clients = new Map(); // A Map object to store WebSocket clients and their associated usernames.
// //ws is the WebSocket connection object that can be used to send and receive messages to/from the connected client.
// wss.on('connection', (ws) => {
//   console.log('New WebSocket connection established');

//   ws.on('message', (message) => {
//     // Convert the buffer message to a string
//     const messageString = message.toString();
//     console.log('Received message from client:', messageString);

//     let parsedMessage;
//     try {
//       parsedMessage = JSON.parse(messageString); // Parse incoming message
//     } catch (error) {
//       console.error('Invalid message format:', error);
//       return;
//     }

//     const { type, username, text } = parsedMessage;

//     if (type === 'join') {
//       // Save username associated with the WebSocket
//       clients.set(ws, username);

//       // Broadcast a "user joined" message to all clients
//       const joinMessage = JSON.stringify({
//         type: 'system',
//         text: `${username} has joined the chat.`,
//       });

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(joinMessage);
//         }
//       });

//       //Then, a system message is created to notify all clients that a new user has joined the chat.
//       //The server loops over all connected clients and sends the join message to all of them,
//       //  but only if the client is still connected (client.readyState === WebSocket.OPEN).
//     } else if (type === 'message') {
//       // Broadcast a regular chat message
//       const chatMessage = JSON.stringify({
//         type: 'message',
//         username,
//         text,
//       });

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(chatMessage);
//         }
//       });
//     }
//   });

//   ws.on('close', () => {
//     const username = clients.get(ws);
//     clients.delete(ws); // Remove user from the clients map

//     if (username) {
//       // Notify others that the user has left
//       const leaveMessage = JSON.stringify({
//         type: 'system',
//         text: `${username} has left the chat.`,
//       });

//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(leaveMessage);
//         }
//       });
//     }

//     console.log('WebSocket connection closed');
//   });
// });

// Express server setup
app.use(bodyParser.json());
app.use(cors());

app.use(morgan('tiny')); // Logs HTTP requests
app.use(responseTime((req, res, time) => {
    console.log(`Response time is : ${time}ms`);
}));

app.use(bodyParser.urlencoded({ extended: true }));

//decypt 
app.use(decryptMiddleware);


// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log('Swagger docs available at http://localhost:3000/api-docs');


// Routes
app.use('/api', routes);


//encrypt
app.use(encryptMiddleware);

// Global Error Handler
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

// // Upgrade HTTP server to support WebSocket
// app.server = app.listen(process.env.PORT || 3000, () => {
//   console.log(`Server running on port ${process.env.PORT || 3000}`);
//    // Run the process once at startup
//   processPendingFiles();

//   // Schedule CRON Job every 10 minutes
//   cron.schedule('*/10 * * * *', processPendingFiles);
//   console.log('CRON Job scheduled: Runs every 10 minutes.');
// });

 const PORT=3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
   //Run the process once at startup
   processPendingFiles();

 // Schedule CRON Job every 10 minutes
 cron.schedule('*/10 * * * *', processPendingFiles);
  console.log('CRON Job scheduled: Runs every 10 minutes.');
});

// // Handle WebSocket upgrade request
// app.server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

