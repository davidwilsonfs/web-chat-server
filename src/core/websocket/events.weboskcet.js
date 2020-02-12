import * as constants from './constants.websocket';
import { channelService } from '../../resource/channel';
import { userService } from '../../resource/user';
import { messageService } from '../../resource/message';

export default class SocketEvents {
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
    this.eventsListner();
  }

  eventsListner() {
    const { socket } = this;

    socket.on(constants.ADD_USER_EVENT, data => {
      this.joinUser(data);
    });

    socket.on(constants.ADD_ROOM_EVENT, () => {
      this.updateRooms();
    });

    socket.on(constants.JOIN_ROOM_EVENT, room => {
      this.joinRoom(room);
    });

    socket.on(constants.SWITCH_ROOM_EVENT, newRoom => {
      this.switchRoom(newRoom);
    });

    socket.on(constants.NEW_MESSAGE_EVENT, message => {
      this.sendMessage(message);
    });

    socket.on(constants.REFRESH_PAGE_EVENT, data => {
      this.refreshPage(data);
    });

    socket.on(constants.DISCONNECT_EVENT, () => {
      console.log(`${socket.username} should be remove`);
    });
  }

  async joinUser(data) {
    const { socket, io } = this;

    const { username } = data;

    socket.username = username;
    const user = await userService.findByUsername(username);

    socket.room = user.channel.alias;
    await channelService.incrementUserAmount(socket.room, 1);

    socket.join(socket.room);
    const users = await userService.findAll();
    io.sockets.in(socket.room).emit(constants.USER_JOINED_EVENT, users);
    await this.updateRooms();
  }

  async refreshPage(data) {
    const { socket, io } = this;
    const { username } = data;

    socket.username = username;

    const user = await userService.findByUsername(username);
    const { channel } = user;

    socket.room = channel.alias;
    socket.join(socket.room);
    socket.emit(constants.REFRESH_PAGE_UPDATE_EVENT, { channel: channel.alias, user });

    let users;
    if (socket.room === 'general') {
      users = await userService.findAll();
      await this.updateRooms();
    } else {
      users = await userService.findUsersByChannel(socket.room);
    }

    io.sockets.in(socket.room).emit(constants.USER_JOINED_EVENT, users);
  }

  async sendMessage(message) {
    const { io, socket } = this;

    const data = {
      text: message.text,
      channel: message.channel.name,
      user: message.user.username,
    };

    await messageService.insertMessage(data);

    io.sockets.in(socket.room).emit(constants.CHAT_MESSAGE_EVENT);
  }

  async updateRooms() {
    const { socket, io } = this;
    const rooms = await channelService.findAll();

    io.sockets.in(socket.room).emit(constants.UPDATE_ROOMS_EVENTS, rooms);
  }

  // joinRoom(room) {
  //   const { socket } = this;

  //   socket.room = room;
  //   socket.join(room);
  //   socket.broadcast
  //     .to(room)
  //     .emit(constants.UPDATE_CHAT_EVENT, `${socket.username} have connected to ${room}`);
  // }

  async switchRoom(newRoom) {
    const { socket, io } = this;

    if (newRoom !== socket.room) {
      await channelService.incrementUserAmount(socket.room, -1);
      await channelService.incrementUserAmount(newRoom, 1);

      // socket.broadcast
      //   .to(socket.room)
      //   .emit(constants.NOTIFICATION_EVENT, `${socket.username} has list this room`);

      if (socket.room === 'general') {
        // por eenquanto

        await this.updateRooms();
      }

      socket.leave(socket.room);
      socket.room = newRoom;
      socket.join(newRoom);

      const { room, username } = socket;
      await userService.updateUser({ username, room });

      // socket.broadcast
      //   .to(newRoom)
      //   .emit(constants.NOTIFICATION_EVENT, `${socket.username}  you have connected to ${newRoom}`);

      let users;

      if (newRoom === 'general') {
        users = await userService.findAll();
        await this.updateRooms();
      } else {
        users = await userService.findUsersByChannel(socket.room);
      }

      io.sockets.in(socket.room).emit(constants.USER_JOINED_EVENT, users);
    }
  }
}
