import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

MessageSchema.plugin(aggregatePaginate);
const Message = mongoose.model('Message', MessageSchema);

export { Message };
