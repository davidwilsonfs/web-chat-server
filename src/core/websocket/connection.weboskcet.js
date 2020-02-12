import socketIo from 'socket.io';
import * as constants from './constants.websocket';
import SocketEvents from './events.weboskcet';

export default server => {
  const connections = [];
  const io = socketIo(server);

  io.on(constants.CONNECTION_EVENT, socket => {
    const newConnection = new SocketEvents(socket, io);
    connections.push(newConnection);
  });
};
