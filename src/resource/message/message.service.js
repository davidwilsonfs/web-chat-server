// import httpStatus from 'http-status-codes';
import httpStatus from 'http-status-codes';
import * as repository from './message.repository';
import * as constants from './message.constants';
import { channelService } from '../channel';
import { userService } from '../user';

import { globalErrorHandler } from '../../core/exceptions';

const getMessagesByChannel = async (channelAlias, createdAt) => {
  try {
    await channelService.findByAlias(channelAlias);

    if (!parseInt(createdAt, 10)) {
      return globalErrorHandler(
        {
          name: httpStatus.getStatusText(httpStatus.BAD_REQUEST),
          message: constants.CREATEDAT_REQUIRED,
        },
        httpStatus.BAD_REQUEST
      );
    }

    return repository.getMessagesByChannel(channelAlias, new Date(createdAt));
  } catch (e) {
    throw e;
  }
};

const getMessagesByUser = async username => {
  try {
    await userService.findByUsername(username);

    return repository.getMessagesByUser(username);
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

export { getMessagesByChannel, getMessagesByUser, insertMessage };
