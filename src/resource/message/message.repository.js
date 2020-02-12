import omitDeep from 'omit-deep';
import { Message } from './message.model';

const getMessagesByChannel = async (channel, options) => {
  try {
    const aggregate = Message.aggregate()
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel')
      .match({ 'channel.alias': channel })
      .sort({ created_at: 1 })
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind('user');

    const { docs, totalPages, totalDocs, nextPage, prevPage } = await Message.aggregatePaginate(
      aggregate,
      options
    );

    const cleanData = omitDeep(docs, ['_id', '__v']);
    return {
      data: cleanData,
      metadata: { totalPages, totalDocs, nextPage, prevPage },
    };
  } catch (e) {
    throw e;
  }
};

const getMessages = async (channel, createdAt) => {
  try {
    const aggregate = Message.aggregate()
      .match({ created_at: { $gte: createdAt } })
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel')
      .match({ 'channel.alias': channel })
      .sort({ created_at: 1 })
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind('user');

    const data = await aggregate;
    return omitDeep(data, ['_id', '__v']);
  } catch (e) {
    throw e;
  }
};

const getMessagesByUser = async (user, options) => {
  try {
    const aggregate = Message.aggregate()
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind('user')
      .match({ 'user.username': user })
      .sort({ created_at: -1 })
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel');

    const { docs, totalPages, totalDocs, nextPage, prevPage } = await Message.aggregatePaginate(
      aggregate,
      options
    );

    const cleanData = omitDeep(docs, ['_id', '__v']);
    return {
      data: cleanData,
      metadata: { totalPages, totalDocs, nextPage, prevPage },
    };
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

export { getMessagesByChannel, getMessagesByUser, insert, getMessages };
