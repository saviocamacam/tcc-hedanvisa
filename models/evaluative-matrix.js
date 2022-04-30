const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProfileProfessor',
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: true,
    },
    discipline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Discipline',
      required: true,
    },
    period: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Period',
      required: true,
    },
    valuations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Valuation',
        required: true,
      },
    ],
    recoveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Valuation',
        required: true,
      },
    ],
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['waiting', 'accepted', 'denied', 'closed'],
      default: 'waiting',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

module.exports = mongoose.model('EvaluativeMatrix', schema);
