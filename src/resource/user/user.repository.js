import omitDeep from 'omit-deep';
import { User } from './user.model';

const findAll = async options => {
  try {
    const aggregate = User.aggregate();

    const { docs, totalPages, totalDocs, nextPage, prevPage } = await User.aggregatePaginate(
      aggregate,
      options
    );

    const cleanData = omitDeep(docs, ['__v']);
    return {
      data: cleanData,
      metadata: { totalPages, totalDocs, nextPage, prevPage },
    };
  } catch (e) {
    throw e;
  }
};

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

const findUsersByChannel = async alias => {
  try {
    const data = await User.aggregate()
      .lookup({
        from: 'channels',
        localField: 'channel',
        foreignField: '_id',
        as: 'channel',
      })
      .unwind('channel')
      .match({ 'channel.alias': alias });

    const cleanData = omitDeep(data, ['__v', '_id']);
    return cleanData;
  } catch (e) {
    throw e;
  }
};
export { findByUsername, leftUser, joinUser, findAll, getAll, updateUser, findUsersByChannel };
