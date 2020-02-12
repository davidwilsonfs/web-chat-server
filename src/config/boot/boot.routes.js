import cors from '../../core/security/cors-strategy.security';
import { userRouting } from '../../resource/user';
import { channelRouting } from '../../resource/channel';
import { messageRouting } from '../../resource/message';
import { authRouting } from '../../core/auth';
import { imagesRouting } from '../../resource/images';

export default app => {
  app.use(cors);
  app.use(`${process.env.API_BASE_PATH}/auth`, authRouting);
  app.use(`${process.env.API_BASE_PATH}/images`, imagesRouting);
  app.use(`${process.env.API_BASE_PATH}/users`, userRouting);
  app.use(`${process.env.API_BASE_PATH}/channels`, channelRouting);
  app.use(`${process.env.API_BASE_PATH}/messages`, messageRouting);
};
