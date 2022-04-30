const mongoose = require('mongoose');

const { Schema } = mongoose;

const EnrollmentValuationSchema = mongoose.Schema({
  valuation: {
    type: Schema.Types.ObjectId,
    ref: 'Valuation',
    required: true,
  },
  enrollment: {
    type: Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
  },
  value: { type: Schema.Types.Number },
});

module.exports = mongoose.model('EnrollmentValuation', EnrollmentValuationSchema);
