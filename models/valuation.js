const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    description: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    assigned: { type: mongoose.Schema.Types.Boolean, default: false },
    recovered: { type: mongoose.Schema.Types.Boolean, default: false },
    valuations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Valuation"
      }
    ],
    weight: {
      type: mongoose.Schema.Types.Number,
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam"
    },
    evaluativeMatrix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluativeMatrix",
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Valuation", schema);
