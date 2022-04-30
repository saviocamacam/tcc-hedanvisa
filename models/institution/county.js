const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CountySchema = new Schema({
  name: String,
  external_id: String,
  available: Boolean
});

module.exports = mongoose.model("County", CountySchema);