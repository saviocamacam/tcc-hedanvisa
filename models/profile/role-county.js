const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require("./role");

const RoleCountySchema = new Schema({
  county: {
    type: Schema.Types.ObjectId,
    ref: "ProfileCountyInstitutional"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "ProfileAdmin"
  },
  type: String
});

module.exports = RoleCounty = Role.discriminator(
  "RoleCounty",
  RoleCountySchema
);
