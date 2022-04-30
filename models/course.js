const mongoose = require('mongoose');

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    name: { type: Schema.Types.String, required: true, unique: true },
    saeName: { type: Schema.Types.String },
    disciplines: [{ type: Schema.Types.ObjectId, ref: 'Discipline' }],
    series: [{ type: Schema.Types.String }],
    shift: Schema.Types.String,
    saeCode: { type: Schema.Types.String, required: true, unique: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

module.exports = mongoose.model('Course', CourseSchema);
