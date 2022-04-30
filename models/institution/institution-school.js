const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Institution = require("./institution");

const InstitutionSchoolSchema = new Schema({
  series: String,
  shift: String,
  course: String,
  subClass: String,
  hour: String,
  profile: {
    type: Schema.Types.ObjectId,
    ref: "ProfileSchoolInstitutional"
  }
});

module.exports = Institution.discriminator(
  "InstitutionSchool",
  InstitutionSchoolSchema
);
