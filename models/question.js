var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var QuestionSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Profile" },
    complexity: { type: Schema.Types.Number, min: 1, max: 100 },
    discipline: { type: Schema.Types.ObjectId, ref: "Discipline" },
    licence: {},
    document: { type: Schema.Types.ObjectId, ref: "Document" },
    answer: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }]
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Question", QuestionSchema);
