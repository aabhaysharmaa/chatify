import { Server } from "socket.io";
import http from "http";
import express from "express";
import "dotenv/config";

import SocketAuthMiddleware from "../middlewares/socketAuthMiddleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// ---------------------------------------------
//  Apply Socket Authentication Middleware
// ---------------------------------------------
io.use(SocketAuthMiddleware);

// Track all active socket connections
const userSocketMap = {}; // { userId: socketId }

// ---------------------------------------------
//  MAIN SOCKET CONNECTION LOGIC
// ---------------------------------------------
io.on("connection", (socket) => {
  if (!socket.user || !socket.user._id) {
    console.log("❌ Unauthorized socket attempt - missing user data");
    socket.disconnect();
    return;
  }

  const userId = String(socket.user._id);

  console.log(`✅ User connected: ${socket.user.fullName} (${userId})`);

  // Save socket
  userSocketMap[userId] = socket.id;

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ---------------------------------------------
  //  RECEIVE MESSAGE FROM CLIENT
  // ---------------------------------------------
  socket.on("sendMessage", ({ receiverId, message, tempId }) => {
    if (!receiverId || !message) {
      console.log("❌ sendMessage missing fields", { receiverId, message });
      return;
    }

    const receiverSocketId = userSocketMap[receiverId];

    const msgPayload = {
      _id: Date.now(),
      senderId: userId,
      receiverId,
      message,
      tempId: tempId || null,
      createdAt: new Date(),
    };

    // 🚀 Send message to receiver (if online)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", msgPayload);
    }

    // 🟢 Also send message back to the sender for local sync
    io.to(socket.id).emit("newMessage", msgPayload);

    console.log(`📨 Message sent from ${userId} to ${receiverId}`);
  });

  // ---------------------------------------------
  //  DISCONNECT HANDLER
  // ---------------------------------------------
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log(`❎ User disconnected: ${socket.user.fullName}`);
  });
});

export { io, app, server, userSocketMap };
