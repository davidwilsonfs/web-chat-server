import httpStatus from 'http-status-codes';
import * as userService from './user.service';
import * as constants from './user.constants';
import { validateError } from '../../core/exceptions';
import TokenGenerator from '../../core/security/token-generator.security';

const getAllUsers = async (req, res, next) => {
  try {
    const data = await userService.getAll();

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const getAvailable = async (req, res, next) => {
  try {
    const { params } = req;
    const { username } = params;

    const data = await userService.getAvailable(username);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const joinUserOnChat = async (req, res, next) => {
  try {
    validateError(req);

    const { body: data } = req;

    await userService.joinUser(data);

    const { username } = data;

    const { _id: id } = await userService.findByUsername(username);

    const payload = {
      id,
      keyName: username,
    };

    const tokenGenerator = new TokenGenerator(process.env.JWT_PRIVATE_KEY);
    const jwtToken = tokenGenerator.sign(payload);

    res.status(httpStatus.CREATED).json(jwtToken);
  } catch (e) {
    next(e);
  }
};

const getUsersByChannel = async (req, res, next) => {
  try {
    const { params } = req;
    const { channelAlias } = params;
    const data = await userService.findUsersByChannel(channelAlias);

    res.status(httpStatus.OK).json(data);
  } catch (e) {
    next(e);
  }
};

const leftUserOnChat = async (req, res, next) => {
  try {
    console.log('aquiiii');

    const { params } = req;
    const { username } = params;

    console.log(username);
    await userService.leftUser(username);

    res.status(httpStatus.OK).json({
      message: constants.USER_LEFT,
    });
  } catch (e) {
    next(e);
  }
};

export { getAllUsers, getAvailable, joinUserOnChat, leftUserOnChat, getUsersByChannel };
