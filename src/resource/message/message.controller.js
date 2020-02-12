import httpStatus from 'http-status-codes';
import * as messageService from './message.service';
import * as constants from './message.constants';
import { validateError } from '../../core/exceptions';

const getMessagesByChannel = async (req, res, next) => {
  try {
    validateError(req);
    const { params, query } = req;
    const { channel } = params;

    let { limit, page } = query;

    limit = limit || 10;
    page = page || 1;

    const options = { limit, page };

    const data = await messageService.getMessagesByChannel(channel, options);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { params } = req;
    const { channel, createdAt } = params;

    const data = await messageService.getMessages(channel, new Date(createdAt));

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const getMessagesByUser = async (req, res, next) => {
  try {
    validateError(req);
    const { params, query } = req;
    const { user } = params;

    let { limit, page } = query;

    limit = limit || 10;
    page = page || 1;

    const options = { limit, page };

    const data = await messageService.getMessagesByUser(user, options);

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

export { getMessagesByChannel, getMessagesByUser, insertMessage, getMessages };
