import socketIo from 'socket.io';
import socketioJwt from 'socketio-jwt';
import * as constants from './constants.websocket';
import SocketEvents from './events.weboskcet';

export default server => {
  const connections = [];
  const io = socketIo(server);

  // io.use(
  //   socketioJwt.authorize({
  //     secret: process.env.JWT_PRIVATE_KEY,
  //     handshake: true,
  //   })
  // );

  io.on(constants.CONNECTION_EVENT, socket => {
    const newConnection = new SocketEvents(socket, io);
    connections.push(newConnection);
  });
};
