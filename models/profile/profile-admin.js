const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Profile = require("./profile");

const ProfileAdminSchema = new Schema({
  role: {
    type: Schema.Types.ObjectId,
    ref: "RoleAdmin"
  },
  schoolRoles: [
    {
      type: Schema.Types.ObjectId,
      ref: "RoleSchool"
    }
  ],
  countyRoles: [
    {
      type: Schema.Types.ObjectId,
      ref: "RoleCounty"
    }
  ],
  showType: {
    type: String,
    default: "Administrador"
  }
});

module.exports = ProfileAdmin = Profile.discriminator(
  "ProfileAdmin",
  ProfileAdminSchema
);
