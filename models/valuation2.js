const mongoose = require('mongoose');

const { Schema } = mongoose;

const ValuationSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required() {
      return this.student == null;
    },
  },
  valuating: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
  exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  student: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProfileStudent',
      required() {
        return this.profile == null;
      },
    },
  ],
  value: { type: Schema.Types.Number },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
});

module.exports = mongoose.model('Valuation', ValuationSchema);
