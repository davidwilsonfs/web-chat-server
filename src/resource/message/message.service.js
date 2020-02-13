// import httpStatus from 'http-status-codes';
import * as repository from './message.repository';
import { channelService } from '../channel';
import { userService } from '../user';

const getMessagesByUser = async username => {
  try {
    const { dateInChannel, channel } = await userService.findByUsername(username);

    const { alias: aliasChannel } = channel;

    return repository.getMessagesFromTimeEntering(aliasChannel, dateInChannel);
  } catch (e) {
    throw e;
  }
};

const insertMessage = async data => {
  try {
    const { aliasChannel, username, text } = data;

    const { _id: userId } = await userService.findByUsername(username);
    const { _id: channelId } = await channelService.findByAlias(aliasChannel);

    const newData = { user: userId, channel: channelId, text };

    return repository.insert(newData);
  } catch (e) {
    throw e;
  }
};

export { getMessagesByUser, insertMessage };
