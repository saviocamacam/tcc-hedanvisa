const mongoose = require('mongoose');

const { Schema } = mongoose;

const DisciplineSchema = new Schema(
  {
    externalId: { type: Schema.Types.String },
    name: { type: Schema.Types.String, required: true, unique: true },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);
module.exports = mongoose.model('Discipline', DisciplineSchema);
