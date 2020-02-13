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

    socket.on(constants.LEFT_CHAT_EVENT, () => {
      this.leftChat();
    });

    socket.on(constants.DISCONNECT_EVENT, () => {
      this.disconnect();
    });
  }

  notificationEvent(text, username, room, icon) {
    const { socket } = this;

    const notifyData = { text, icon, username, room };

    socket.broadcast.to(room).emit(constants.NOTIFICATION_EVENT, notifyData);
  }

  async getUsersByChannel() {
    const { socket } = this;
    const { room } = socket;

    const { CHANNEL_NAME_GENERAL } = process.env;

    if (room === CHANNEL_NAME_GENERAL) {
      await this.updateRooms();
      return userService.getAll();
    }

    return userService.findUsersByChannel(room);
  }

  async disconnect() {
    const { socket } = this;

    const { username } = socket;

    if (username) {
      await userService.updateConnection({ username, disconnect: true });

      socket.disconnect = true;

      setTimeout(() => {
        this.checkDisconnect();
      }, process.env.TIME_DISCONNECT_WEBSOCKET);
    }
  }

  async checkDisconnect() {
    const { socket } = this;
    const { username } = socket;

    const { disconnect } = await userService.findByUsername(username);

    if (disconnect) {
      this.leftChat();
    }
  }

  async joinUser(data) {
    const { socket, io } = this;

    const { username } = data;

    socket.username = username;

    const { channel, urlImage } = await userService.findByUsername(username);

    socket.room = channel.alias;

    const { room } = socket;

    await channelService.incrementUserAmount(room, 1);

    socket.join(room);
    const users = await userService.getAll();

    io.sockets.in(room).emit(constants.USER_JOINED_EVENT, users);

    this.notificationEvent(`${username} connected to ${room}`, username, room, urlImage);

    await this.updateRooms();
  }

  async leftChat() {
    const { socket, io } = this;
    const { username, room } = socket;

    const { urlImage } = await userService.findByUsername(username);

    await userService.leftUser(username);

    this.notificationEvent(`${username} left this room ${room}`, username, room, urlImage);

    const rooms = await channelService.findAll();
    const users = await userService.getAll();

    io.sockets.emit(constants.UPDATE_ROOMS_EVENTS, rooms);

    io.sockets.emit(constants.USER_JOINED_EVENT, users);

    this.socket.leave(room);
  }

  async refreshPage(data) {
    const { socket, io } = this;
    const { username } = data;

    socket.username = username;

    await userService.updateConnection({ username, disconnect: false });

    const user = await userService.findByUsername(username);

    const { channel } = user;

    socket.room = channel.alias;

    const { room } = socket;

    socket.join(room);

    socket.emit(constants.REFRESH_PAGE_UPDATE_EVENT, {
      channel: room,
      user,
    });
    const users = await this.getUsersByChannel();

    io.sockets.in(room).emit(constants.USER_JOINED_EVENT, users);
  }

  async sendMessage(message) {
    const { io, socket } = this;
    const { text } = message;
    const { room, username } = socket;

    await messageService.insertMessage({
      text,
      aliasChannel: room,
      username,
    });

    io.sockets.in(room).emit(constants.CHAT_MESSAGE_EVENT);
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
    const { room, username } = socket;
    const { CHANNEL_NAME_GENERAL } = process.env;

    if (newRoom !== room) {
      await channelService.incrementUserAmount(room, -1);
      await channelService.incrementUserAmount(newRoom, 1);

      const { urlImage } = await userService.findByUsername(socket.username);

      this.notificationEvent(`${username} left this room`, username, room, urlImage);

      console.log('Primeira parte');

      if (room === CHANNEL_NAME_GENERAL) {
        await this.updateRooms();
      }

      socket.leave(room);
      socket.room = newRoom;
      socket.join(newRoom);

      await userService.updateUser({ username, newRoom });

      this.notificationEvent(
        `${socket.username} connected to ${newRoom}`,
        username,
        newRoom,
        urlImage
      );

      const users = await this.getUsersByChannel();

      io.sockets.in(newRoom).emit(constants.USER_JOINED_EVENT, users);
    }
  }
}
