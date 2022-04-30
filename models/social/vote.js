const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var VoteSchema = new Schema(
  {
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    referenced: {
      type: Schema.Types.ObjectId
    },
    type: {
      type: Schema.Types.Number
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Vote", VoteSchema);
