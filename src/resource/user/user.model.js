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
  dateInChannel: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(aggregatePaginate);
const User = mongoose.model('User', UserSchema);

export { User };
