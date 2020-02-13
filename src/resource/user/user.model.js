import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  urlImage: {
    type: String,
  },
  disconnect: {
    type: Boolean,
    default: false,
  },
  dateInChannel: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

async function postRemove(user) {
  try {
    const { channel: channelId } = user;

    await user.model('Channel').findOneAndUpdate({ _id: channelId }, { $inc: { amountUsers: -1 } });

    return user;
  } catch (err) {
    return err;
  }
}

UserSchema.plugin(aggregatePaginate);
UserSchema.post('remove', postRemove);

const User = mongoose.model('User', UserSchema);

export { User };
