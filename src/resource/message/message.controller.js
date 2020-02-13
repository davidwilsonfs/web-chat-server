import httpStatus from 'http-status-codes';
import * as messageService from './message.service';
import * as constants from './message.constants';
import { validateError } from '../../core/exceptions';

const getMessagesByChannel = async (req, res, next) => {
  try {
    const { params, query } = req;
    const { aliasChannel } = params;
    const { createdAt } = query;

    const data = await messageService.getMessagesByChannel(aliasChannel, createdAt);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const getMessagesByUser = async (req, res, next) => {
  try {
    const { params } = req;
    const { username } = params;

    const data = await messageService.getMessagesByUser(username);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const insertMessage = async (req, res, next) => {
  try {
    validateError(req);

    const { body: data } = req;

    await messageService.insertMessage(data);

    res.status(httpStatus.CREATED).json({ message: constants.MESSAGE_INSERTED });
  } catch (e) {
    next(e);
  }
};

export { getMessagesByChannel, getMessagesByUser, insertMessage };
