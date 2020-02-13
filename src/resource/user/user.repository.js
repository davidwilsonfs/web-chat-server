import omitDeep from 'omit-deep';
import { User } from './user.model';

const getAll = async () => {
  try {
    return User.find({});
  } catch (e) {
    throw e;
  }
};

const findByUsername = async username => {
  try {
    return User.findOne({ username })
      .populate('channel')
      .lean();
  } catch (e) {
    throw e;
  }
};

const joinUser = async data => {
  try {
    const user = new User(data);
    return user.save();
  } catch (e) {
    throw e;
  }
};

const leftUser = async id => {
  try {
    return User.findByIdAndDelete(id);
  } catch (e) {
    throw e;
  }
};

const updateUser = async (id, data) => {
  try {
    return User.findByIdAndUpdate({ _id: id }, data);
  } catch (e) {
    throw e;
  }
};

const findUsersByChannel = async channelAlias => {
  try {
    const data = await User.aggregate()
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel')
      .match({ 'channel.alias': channelAlias });

    return omitDeep(data, ['__v', '_id']);
  } catch (e) {
    throw e;
  }
};
export { findByUsername, leftUser, joinUser, getAll, updateUser, findUsersByChannel };
