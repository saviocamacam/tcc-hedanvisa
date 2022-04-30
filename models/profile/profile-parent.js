const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Profile = require("./profile");

const ProfileParentSchema = new Schema({
  kinship: String,
  childs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Link"
    }
  ],
  showType: {
    type: String,
    default: "Familiar"
  }
});

module.exports = ProfileParent = Profile.discriminator(
  "ProfileParent",
  ProfileParentSchema
);
