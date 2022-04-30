const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require("./role");

const RoleSchoolSchema = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    ref: "ProfileSchoolInstitutional"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "ProfileAdmin"
  },

  type: String
});

module.exports = RoleSchool = Role.discriminator(
  "RoleSchool",
  RoleSchoolSchema
);
