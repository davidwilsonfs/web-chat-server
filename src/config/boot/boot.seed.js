import { Channel } from '../../resource/channel/channel.model';
import { log } from './boot.logger';

export default async () => {
  const { CHANNEL_NAME: alias } = process.env;

  const channelStored = await Channel.findOne({ alias });

  if (!channelStored) {
    const channel = new Channel({ alias });
    await channel.save();
    log('STARTSYSTEM', 'Channel stored on system!');
  } else {
    log('STARTSYSTEM', 'Channel exist on system!');
  }
};
