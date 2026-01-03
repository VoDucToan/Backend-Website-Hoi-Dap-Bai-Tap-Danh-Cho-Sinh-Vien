const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
    // Initialize a new instance of Socket.IO by passing the HTTP server
    io = new Server(server, {
        cors: {
            origin: process.env.URL_REACT, // Allow requests from this origin and my frontend port = 5173
            methods: ["GET", "POST"], // Allow these HTTP methods
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on('join_notifications', (userId) => {
            if (userId) {
                socket.join(`user_${userId}`);
                console.log(`Socket ${socket.id} joined room user_${userId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { initSocket, getIO };
