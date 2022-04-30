var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionExamSchema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    exam: { type: Schema.Types.ObjectId, ref: "Exam" },
    weight: { type: Schema.Types.Number }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("QuestionExam", QuestionExamSchema);
