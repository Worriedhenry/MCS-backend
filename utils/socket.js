const userSockets = new Map();
const { getRoomId } = require("../Controllers/chats.js");
module.exports = (io) => {
  io.on('connection', async (socket) => {
    const { userId } = socket.handshake.auth;
    socket.userID = userId;
    userSockets.set(userId, socket.id);
    try {
      const roomsId = await getRoomId(userId)

      for (const room in roomsId) {
        socket.join(roomsId[room]);
      }
    } catch (err) {
      console.log(err)
    }
    socket.on("new room", (data) => {
      const clientSocketId = userSockets.get(data.clientId);
      const serviceProviderSocketId = userSockets.get(data.serviceProviderId);

      if (clientSocketId) {
        const clientSocket = io.sockets.sockets.get(clientSocketId);
        if (clientSocket) {
          clientSocket.join(data.proposalId);
        }
      }

      if (serviceProviderSocketId) {
        const serviceProviderSocket = io.sockets.sockets.get(serviceProviderSocketId);
        if (serviceProviderSocket) {
          serviceProviderSocket.join(data.proposalId);
        }
      }
    });

    socket.on('send-message', (data) => {
      socket.to(data.proposalId).emit('noty', data);
      console.log(io.sockets.adapter.rooms.get(data.proposalId),userSockets);
      socket.to(data.proposalId).emit('receive-message', data);
    })

    socket.on('disconnect', () => {
      userSockets.delete(socket.userID);
      console.log('A user disconnected', io.engine.clientsCount, userSockets.size);
    });

    socket.on('chat message', (msg) => {
      console.log('Message received: ' + msg);
      io.emit('chat message', msg); // Broadcast the message to all connected clients
    });
  });
};


module.exports.userSockets = userSockets;  