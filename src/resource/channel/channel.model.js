import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const ChannelSchema = new mongoose.Schema({
  alias: {
    type: String,
  },
  amountUsers: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

ChannelSchema.plugin(aggregatePaginate);
const Channel = mongoose.model('Channel', ChannelSchema);

const { ObjectId } = mongoose.Types;

export { Channel, ObjectId };
