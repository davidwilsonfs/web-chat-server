// import httpStatus from 'http-status-codes';
import * as repository from './message.repository';
import { channelService } from '../channel';
import { userService } from '../user';

const getMessagesByChannel = async (channel, options) => {
  try {
    await channelService.findByAlias(channel);

    return repository.getMessagesByChannel(channel, options);
  } catch (e) {
    throw e;
  }
};

const getMessages = async (channel, createdAt) => {
  try {
    await channelService.findByAlias(channel);

    return repository.getMessages(channel, createdAt);
  } catch (e) {
    throw e;
  }
};

const getMessagesByUser = async (user, options) => {
  try {
    await userService.findByUsername(user);

    return repository.getMessagesByUser(user, options);
  } catch (e) {
    throw e;
  }
};

const insertMessage = async data => {
  try {
    const { channel, user, text } = data;

    const { _id: userId } = await userService.findByUsername(user);
    const { _id: channelId } = await channelService.findByAlias(channel);

    const newData = { user: userId, channel: channelId, text };

    return repository.insert(newData);
  } catch (e) {
    throw e;
  }
};

export { getMessagesByChannel, getMessagesByUser, insertMessage, getMessages };
