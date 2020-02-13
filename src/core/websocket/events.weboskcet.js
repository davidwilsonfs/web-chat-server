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

    socket.on(constants.USER_TYPING_EVENT, () => {
      this.startTyping();
    });

    socket.on(constants.STOP_TYPING_EVENT, () => {
      this.stopTyping();
    });

    socket.on(constants.DISCONNECT_EVENT, () => {
      console.log(`${socket.username} should be remove`);
    });
  }

  async joinUser(data) {
    const { socket, io } = this;

    const { username } = data;

    socket.username = username;

    const { channel, urlImage } = await userService.findByUsername(username);

    socket.room = channel.alias;

    await channelService.incrementUserAmount(socket.room, 1);

    socket.join(socket.room);
    const users = await userService.findAll();

    io.sockets.in(socket.room).emit(constants.USER_JOINED_EVENT, users);

    const notifyData = {
      text: `${socket.username} connected to ${socket.room}`,
      icon: urlImage,
      username: socket.username,
      room: socket.room,
    };

    socket.broadcast.to(socket.room).emit(constants.NOTIFICATION_EVENT, notifyData);

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

    const { CHANNEL_NAME_GENERAL } = process.env;

    if (socket.room === CHANNEL_NAME_GENERAL) {
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
      channelAlias: message.channel.name,
      username: message.user.username,
    };

    await messageService.insertMessage(data);

    io.sockets.in(socket.room).emit(constants.CHAT_MESSAGE_EVENT);
  }

  async updateRooms() {
    const { socket, io } = this;
    const rooms = await channelService.findAll();

    io.sockets.in(socket.room).emit(constants.UPDATE_ROOMS_EVENTS, rooms);
  }

  async startTyping() {
    const { socket, io } = this;

    const { username, room } = socket;

    await userService.findByUsername(username);

    await channelService.updateUsersTyping(room, username);

    const usersTyping = await channelService.getUsersTyping(room);

    io.sockets.in(socket.room).emit(constants.NOTIFY_TYPING_EVENT, usersTyping);
  }

  async stopTyping() {
    const { socket, io } = this;

    const { username, room } = socket;

    await userService.findByUsername(username);

    await channelService.updateUsersStopTyping(room, username);

    const usersTyping = await channelService.getUsersTyping(room);

    io.sockets.in(socket.room).emit(constants.NOTIFY_TYPING_EVENT, usersTyping);
  }

  async switchRoom(newRoom) {
    const { socket, io } = this;

    if (newRoom !== socket.room) {
      await channelService.incrementUserAmount(socket.room, -1);
      await channelService.incrementUserAmount(newRoom, 1);

      const user = await userService.findByUsername(socket.username);

      let notifyData = {
        text: `${socket.username} left this room`,
        icon: user.urlImage,
        username: socket.username,
        room: socket.room,
      };

      socket.broadcast.to(socket.room).emit(constants.NOTIFICATION_EVENT, notifyData);

      const { CHANNEL_NAME_GENERAL } = process.env;

      if (socket.room === CHANNEL_NAME_GENERAL) {
        // por eenquanto
        await this.updateRooms();
      }

      socket.leave(socket.room);
      socket.room = newRoom;
      socket.join(newRoom);

      const { room, username } = socket;
      await userService.updateUser({ username, room });

      notifyData = {
        text: `${socket.username} connected to ${newRoom}`,
        icon: user.urlImage,
        username: socket.username,
        room: socket.room,
      };

      socket.broadcast.to(newRoom).emit(constants.NOTIFICATION_EVENT, notifyData);

      let users;

      if (newRoom === CHANNEL_NAME_GENERAL) {
        users = await userService.findAll();
        await this.updateRooms();
      } else {
        users = await userService.findUsersByChannel(socket.room);
      }

      io.sockets.in(socket.room).emit(constants.USER_JOINED_EVENT, users);
    }
  }
}
