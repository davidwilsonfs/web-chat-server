import omitDeep from 'omit-deep';
import { Message } from './message.model';

const getMessagesFromTimeEntering = async (aliasChannel, dateInChannel) => {
  try {
    const data = await Message.aggregate()
      .match({ created_at: { $gte: dateInChannel } })
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel')
      .match({ 'channel.alias': aliasChannel })
      .sort({ created_at: 1 })
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind({
        path: '$user',
        preserveNullAndEmptyArrays: true,
      });

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

export { getMessagesFromTimeEntering, insert };
