const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Profile = require("./profile");

const ProfileComunitySchema = new Schema({
  institution: {
    type: Schema.Types.ObjectId,
    ref: "Institution"
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "RoleComunity"
  },
  showType: {
    type: String,
    default: "Comunidade"
  },
  type: Schema.Types.String,
  representant: Schema.Types.String,
  voluntary: Schema.Types.String,
  county: {
    type: Schema.Types.ObjectId,
    ref: "Link"
  }
});

module.exports = ProfileComunity = Profile.discriminator(
  "ProfileComunity",
  ProfileComunitySchema
);
