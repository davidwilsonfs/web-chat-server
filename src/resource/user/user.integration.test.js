/* eslint-disable camelcase */
/* eslint-disable no-undef */
import request from 'supertest';
import omitDeep from 'omit-deep';
import mongoose from 'mongoose';
import dummyjson from 'dummy-json';
import * as constants from './user.constants';
import { User } from './user.model';
import TokenGenerator from '../../core/security/token-generator.security';
import * as app from '../../app';

const { ObjectId } = mongoose.Types;
let userPostTest;
let userPost;
let authToken;

const mockUser = () =>
  JSON.parse(
    dummyjson.parse(`{
    "_id": "${new ObjectId()}",
    "username": "{{firstName}}",
    "urlImage": "{{domain}}"
    }`)
  );

const mockUserPost = () =>
  JSON.parse(
    dummyjson.parse(`{
    "username": "{{firstName}}",
    "urlImage": "{{domain}}"
    }`)
  );

describe(`${process.env.API_BASE_PATH}/users`, () => {
  beforeEach(async done => {
    jest.setTimeout(10000);
    userPostTest = mockUserPost();
    userPost = mockUser();

    const payload = {
      // eslint-disable-next-line no-underscore-dangle
      id: userPost._id,
      keyName: userPost.username,
    };

    const { token } = new TokenGenerator(process.env.JWT_PRIVATE_KEY).sign(payload);

    authToken = token;

    await User.create(userPost);

    done();
  });

  afterEach(async done => {
    await User.remove({});
    await app.server.close();
    done();
  });

  describe('GET /users', () => {
    it('should return 401 if no token provided', async done => {
      const { status } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users`)
        .set('Authorization', '');

      expect(status).toBe(401);
      done();
    });

    it('should return all users', async done => {
      const { body, status } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users`)
        .set('Authorization', authToken);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(1);
      done();
    });

    it('should return empty array if does not exist users', async done => {
      await User.remove({});

      const { body, status } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users`)
        .set('Authorization', authToken);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBe(0);
      done();
    });
  });

  describe('GET /users/channel/{channelAlias}', () => {
    it('should return 401 if no token provided', async done => {
      const { status } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users/channel/channelAlias`)
        .set('Authorization', '');

      expect(status).toBe(401);
      done();
    });

    it('should return all users by channel', async done => {
      const { CHANNEL_NAME_GENERAL } = process.env;

      const { body, status } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users/channel/${CHANNEL_NAME_GENERAL}`)
        .set('Authorization', authToken);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      done();
    });

    it('should return 404 if channelAlias is not valid', async done => {
      const { status } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users/channel/channelAlias`)
        .set('Authorization', authToken);

      expect(status).toBe(404);
      done();
    });
  });

  describe('GET /users/available/{username}', () => {
    it('should return available if username does not exist', async () => {
      const { username } = userPostTest;

      const { status, body } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users/available/${username}`)
        .set('Authorization', authToken);

      expect(status).toBe(200);
      expect(body).toHaveProperty('available', true);
    });

    it('should return 400 if username passed is not available', async () => {
      const { username } = userPost;

      const { status, body } = await request(app.server)
        .get(`${process.env.API_BASE_PATH}/users/available/${username}`)
        .set('Authorization', authToken);

      expect(status).toBe(200);
      expect(body).toHaveProperty('available', false);
    });
  });

  describe('POST /users', () => {
    it('should save a user if it is valid', async () => {
      const { status, body } = await request(app.server)
        .post(`${process.env.API_BASE_PATH}/users/join`)
        .send(userPostTest);

      expect(status).toBe(201);
      expect(body).toHaveProperty('token');
      expect(body).toHaveProperty('expiresIn');
    });

    it('should not save a user if username missing', async () => {
      userPostTest = omitDeep(userPostTest, 'username');
      const { status, body } = await request(app.server)
        .post(`${process.env.API_BASE_PATH}/users/join`)
        .send(userPostTest);

      expect(status).toBe(400);
      expect(body).toHaveProperty('errors');
    });

    it('should not save a user if urlImage missing', async () => {
      userPostTest = omitDeep(userPostTest, 'urlImage');
      const { status, body } = await request(app.server)
        .post(`${process.env.API_BASE_PATH}/users/join`)
        .send(userPostTest);

      expect(status).toBe(400);
      expect(body).toHaveProperty('errors');
    });
  });

  describe('DELETE /users/left/{username}', () => {
    it('should return 401 if no token provided', async () => {
      const { status } = await request(app.server)
        .delete(`${process.env.API_BASE_PATH}/users/left/username`)
        .set('Authorization', '');

      expect(status).toBe(401);
    });

    it('should return 404 if no user with the given id exists', async () => {
      const { username } = userPostTest;

      const { status } = await request(app.server)
        .delete(`${process.env.API_BASE_PATH}/users/left/${username}`)
        .set('Authorization', authToken);

      expect(status).toBe(404);
    });

    it('should delete the user if id is valid', async () => {
      const { username } = userPost;

      const { status, body } = await request(app.server)
        .delete(`${process.env.API_BASE_PATH}/users/left/${username}`)
        .set('Authorization', authToken);

      expect(status).toBe(200);
      expect(body).toHaveProperty('message', constants.USER_LEFT);
    });
  });
});
