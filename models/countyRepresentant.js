var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CountyRepresentantSchema = new Schema(
  {
    county: {
      type: Schema.Types.ObjectId,
      ref: "county"
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "profile"
    },
    createdAt: Date,
    finishedAt: Date
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("CountyRepresentant", CountyRepresentantSchema);
