import { Channel } from '../../resource/channel/channel.model';
import { log } from './boot.logger';

export default async () => {
  const { CHANNEL_NAME_GENERAL } = process.env;

  const channelStored = await Channel.findOne({ CHANNEL_NAME_GENERAL });

  if (!channelStored) {
    const channel = new Channel({ CHANNEL_NAME_GENERAL });
    await channel.save();
    log('STARTSYSTEM', 'Channel stored on system!');
  } else {
    log('STARTSYSTEM', 'Channel exist on system!');
  }
};
