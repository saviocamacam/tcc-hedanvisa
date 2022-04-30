var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var InstitutionSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "AdminProfile"
  },
  external_id: String,
  county: {
    type: Schema.Types.ObjectId,
    ref: "County",
  },
  name: String,
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address"
  }
});

module.exports = mongoose.model("Institution", InstitutionSchema);