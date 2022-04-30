const mongoose = require('mongoose');

const { Schema } = mongoose;

const ExamSchema = new Schema(
  {
    valuations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Valuation',
      },
    ],
    owner: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    date: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom' },
    discipline: { type: Schema.Types.ObjectId, ref: 'Discipline' },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

module.exports = mongoose.model('Exam', ExamSchema);
