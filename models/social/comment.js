const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    answers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    countAnswers: Schema.Types.Number,
    title: Schema.Types.String,
    message: Schema.Types.String,
    votes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vote"
      }
    ],
    countVotes: Schema.Types.Number,
    only: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
