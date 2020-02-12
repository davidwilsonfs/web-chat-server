import omitDeep from 'omit-deep';
import { Channel } from './channel.model';

const findAll = async () => {
  try {
    const data = await Channel.aggregate().match({ alias: { $ne: 'general' } });

    const cleanData = omitDeep(data, ['_id', '__v']);
    return cleanData;
  } catch (e) {
    throw e;
  }
};

const findByAlias = async alias => {
  try {
    return Channel.findOne({ alias });
  } catch (e) {
    throw e;
  }
};

const register = async data => {
  try {
    const channel = new Channel(data);
    return channel.save();
  } catch (e) {
    throw e;
  }
};

const remove = async id => {
  try {
    return Channel.findByIdAndDelete(id);
  } catch (e) {
    throw e;
  }
};

const incrementUserAmount = async (id, number) => {
  try {
    return Channel.findOneAndUpdate({ _id: id }, { $inc: { amountUsers: number } });
  } catch (e) {
    throw e;
  }
};

export { findAll, findByAlias, register, remove, incrementUserAmount };
