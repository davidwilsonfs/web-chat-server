import omitDeep from 'omit-deep';
import { Message } from './message.model';

const getMessagesByChannel = async (channelAlias, createdAt) => {
  try {
    const data = await Message.aggregate()
      .match({ created_at: { $gte: createdAt } })
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel')
      .match({ 'channel.alias': channelAlias })
      .sort({ created_at: 1 })
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind('user');

    return omitDeep(data, ['_id', '__v']);
  } catch (e) {
    throw e;
  }
};

const getMessagesByUser = async username => {
  try {
    const data = await Message.aggregate()
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind('user')
      .match({ 'user.username': username })
      .sort({ created_at: -1 })
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel');

    return omitDeep(data, ['_id', '__v']);
  } catch (e) {
    throw e;
  }
};

const insert = async data => {
  try {
    const message = new Message(data);
    return message.save();
  } catch (e) {
    throw e;
  }
};

export { getMessagesByChannel, getMessagesByUser, insert };
