import { Server } from 'socket.io';
let io;
const connectedUsers = {}; 

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.on("register-user", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`✅ Usuario ${userId} registrado con socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of Object.entries(connectedUsers)) {
        if (sockId === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
      console.log("🔴 Usuario desconectado:", socket.id);
    });
  });
};

export const sendNotificationToUser = (userId, payload) => {
  const socketId = connectedUsers[userId];
  if (socketId && io) {
    io.to(socketId).emit("nueva-notificacion", payload);
    console.log(`📩 Notificación enviada a ${userId}`);
  } else {
    console.log(`⚠️ Usuario ${userId} no conectado`);
  }
};
