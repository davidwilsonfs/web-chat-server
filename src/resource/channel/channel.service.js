import _ from 'lodash';
import httpStatus from 'http-status-codes';
import { EXIST_CHANNEL, CHANNEL_NOT_FOUND } from './channel.constants';
import * as repository from './channel.repository';
import { globalErrorHandler } from '../../core/exceptions';

const findAll = async () => {
  try {
    return repository.findAll();
  } catch (e) {
    throw e;
  }
};

const register = async channel => {
  try {
    const { alias } = channel;
    const isExisted = await repository.findByAlias(alias);

    if (!_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.BAD_REQUEST), message: EXIST_CHANNEL },
        httpStatus.BAD_REQUEST
      );
    }

    return repository.register(channel);
  } catch (e) {
    throw e;
  }
};

const remove = async alias => {
  try {
    const isExisted = await repository.findByAlias(alias);

    if (_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.NOT_FOUND), message: CHANNEL_NOT_FOUND },
        httpStatus.NOT_FOUND
      );
    }

    const { _id: id } = isExisted;

    return repository.remove(id);
  } catch (e) {
    throw e;
  }
};

const findChannel = async alias => {
  try {
    const isExisted = await repository.findByAlias(alias);

    if (_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.NOT_FOUND), message: CHANNEL_NOT_FOUND },
        httpStatus.NOT_FOUND
      );
    }

    const { _id: id } = isExisted;

    return repository.remove(id);
  } catch (e) {
    throw e;
  }
};

const findByAlias = async alias => {
  try {
    const isExisted = await repository.findByAlias(alias);

    if (_.isEmpty(isExisted)) {
      return globalErrorHandler(
        { name: httpStatus.getStatusText(httpStatus.NOT_FOUND), message: CHANNEL_NOT_FOUND },
        httpStatus.NOT_FOUND
      );
    }

    return isExisted;
  } catch (e) {
    throw e;
  }
};

const incrementUserAmount = async (alias, number) => {
  try {
    const { _id: id } = await findByAlias(alias);

    return repository.incrementUserAmount(id, number);
  } catch (e) {
    throw e;
  }
};

export { findAll, findChannel, register, remove, findByAlias, incrementUserAmount };