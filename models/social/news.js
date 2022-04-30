const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var NewsSchema = new Schema(
  {
    text: {
      type: Schema.Types.String
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    user: String,
    avatar: String,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    votes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vote"
      }
    ],
    visibility: {
      type: Schema.Types.String,
      enum: ["public", "link"]
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("News", NewsSchema);
