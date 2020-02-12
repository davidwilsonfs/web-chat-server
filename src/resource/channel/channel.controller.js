import httpStatus from 'http-status-codes';
import * as channelService from './channel.service';
import * as constants from './channel.constants';
import { validateError } from '../../core/exceptions';

const getChannels = async (req, res, next) => {
  try {
    validateError(req);

    const { params } = req;
    const { id } = params;

    const data = await channelService.findAll(id);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const getChannel = async (req, res, next) => {
  try {
    validateError(req);

    const { params } = req;
    const { alias } = params;

    const data = await channelService.findByAlias(alias);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const createChannel = async (req, res, next) => {
  try {
    validateError(req);

    const { body: data } = req;

    await channelService.register(data);

    res.status(httpStatus.CREATED).json({ message: constants.CHANNEL_CREATED });
  } catch (e) {
    next(e);
  }
};

const deleteChannel = async (req, res, next) => {
  try {
    validateError(req);

    const { params } = req;
    const { alias } = params;

    await channelService.remove(alias);

    res.status(httpStatus.OK).json({
      message: constants.CHANNEL_DELETED,
    });
  } catch (e) {
    next(e);
  }
};

export { getChannels, deleteChannel, createChannel, getChannel };
