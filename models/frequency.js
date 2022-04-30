const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const FrequencySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    revisors: [{}],
    date: {
      type: Schema.Types.Date,
    },
    content: Schema.Types.String,
    obs: {
      type: Schema.Types.String,
    },
    meta: {
      type: Object,
    },
    students: [{}],
    status: {
      type: Schema.Types.String,
      enum: ['accepted', 'waiting', 'denied', 'closed'],
      default: 'accepted',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

FrequencySchema.plugin(paginate);

module.exports = mongoose.model('Frequency', FrequencySchema);
