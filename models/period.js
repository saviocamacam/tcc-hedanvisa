const mongoose = require('mongoose');

const { Schema } = mongoose;

const PeriodSchema = new Schema(
  {
    start: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    end: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'ProfileCountyInstitutional',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'ProfileCounty',
    },
    schoolYear: {
      type: Schema.Types.ObjectId,
      ref: 'SchoolYear',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

module.exports = mongoose.model('Period', PeriodSchema);
