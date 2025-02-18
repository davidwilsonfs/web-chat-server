import _ from 'lodash';
import httpStatus from 'http-status-codes';
import { EXIST_USER, USER_NOT_FOUND } from './user.constants';
import * as repository from './user.repository';
import { channelService } from '../channel';
import { globalErrorHandler } from '../../core/exceptions';

const getAll = async () => {
  try {
    return repository.getAll();
  } catch (e) {
    throw e;
  }
};

const getAvailable = async username => {
  try {
    const data = await repository.findByUsername(username);

    return { available: _.isEmpty(data) };
  } catch (e) {
    throw e;
  }
};

const joinUser = async user => {
  try {
    const { username } = user;
    const isExisted = await repository.findByUsername(username);

    if (!_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.BAD_REQUEST), message: EXIST_USER },
        httpStatus.BAD_REQUEST
      );
    }

    const { CHANNEL_NAME_GENERAL } = process.env;

    const { _id: id } = await channelService.findByAlias(CHANNEL_NAME_GENERAL);

    const userModified = Object.assign({ channel: id }, user);

    await repository.joinUser(userModified);

    return userModified;
  } catch (e) {
    throw e;
  }
};

const leftUser = async username => {
  try {
    const isExisted = await repository.findByUsername(username);

    if (_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.NOT_FOUND), message: USER_NOT_FOUND },
        httpStatus.NOT_FOUND
      );
    }

    const { _id: id } = isExisted;

    return repository.leftUser(id);
  } catch (e) {
    throw e;
  }
};

const findByUsername = async username => {
  try {
    const isExisted = await repository.findByUsername(username);

    if (_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.NOT_FOUND), message: USER_NOT_FOUND },
        httpStatus.NOT_FOUND
      );
    }

    return isExisted;
  } catch (e) {
    throw e;
  }
};

const updateUser = async data => {
  try {
    const { username, newRoom: alias } = data;

    const { _id: userId } = await findByUsername(username);

    const { _id: channelId } = await channelService.findByAlias(alias);

    const updateData = { dateInChannel: new Date(), channel: channelId };
    await repository.updateUser(userId, updateData);
  } catch (e) {
    throw e;
  }
};

const updateConnection = async data => {
  try {
    const { username } = data;

    const { _id: userId } = await findByUsername(username);

    await repository.updateUser(userId, data);
  } catch (e) {
    throw e;
  }
};

const findUsersByChannel = async channelAlias => {
  try {
    await channelService.findByAlias(channelAlias);

    return repository.findUsersByChannel(channelAlias);
  } catch (e) {
    throw e;
  }
};

export {
  leftUser,
  joinUser,
  getAvailable,
  getAll,
  updateConnection,
  findUsersByChannel,
  updateUser,
  findByUsername,
};
