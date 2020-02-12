import _ from 'lodash';
import httpStatus from 'http-status-codes';
import { EXIST_USER, USER_NOT_FOUND } from './user.constants';
import * as repository from './user.repository';
import { channelService } from '../channel';
import { globalErrorHandler } from '../../core/exceptions';

const getAll = async options => {
  try {
    return repository.findAll(options);
  } catch (e) {
    throw e;
  }
};

const findAll = async () => {
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

    const { _id: id } = await channelService.findByAlias('general');

    const userModified = Object.assign({ channel: id }, user);

    console.log(userModified);
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
    const { username, room: channel } = data;

    const { _id: userId } = await repository.findByUsername(username);

    const { _id: channelId } = await channelService.findByAlias(channel);

    const updateData = { dateInChannel: new Date(), channel: channelId };
    await repository.updateUser(userId, updateData);
  } catch (e) {
    throw e;
  }
};

const findUsersByChannel = async alias => {
  try {
    console.log(alias);
    await channelService.findByAlias(alias);

    return repository.findUsersByChannel(alias);
  } catch (e) {
    throw e;
  }
};

export {
  leftUser,
  joinUser,
  getAvailable,
  getAll,
  findAll,
  findUsersByChannel,
  updateUser,
  findByUsername,
};
