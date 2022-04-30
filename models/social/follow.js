const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var FollowSchema = new Schema(
  {
    followed: {
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    bidirectional: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Follow", FollowSchema);
