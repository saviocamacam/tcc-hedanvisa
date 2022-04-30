const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Profile = require("./profile");

const ProfileStudentSchema = new Schema({
  level: String,
  serie: String,
  school: {
    type: Schema.Types.ObjectId,
    ref: "Link"
  },
  relatives: [
    {
      type: Schema.Types.ObjectId,
      ref: "Link"
    }
  ],
  showType: {
    type: String,
    default: "Aluno"
  },
  enrollments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Link"
    }
  ]
});

module.exports = ProfileStudent = Profile.discriminator(
  "ProfileStudent",
  ProfileStudentSchema
);
