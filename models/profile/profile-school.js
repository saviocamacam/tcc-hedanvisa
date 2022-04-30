const mongoose = require('mongoose');

const { Schema } = mongoose;
const Profile = require('./profile');

const ProfileSchoolSchema = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'RoleSchool',
  },
  showType: {
    type: String,
    default: 'Gestão Escolar',
  },
});

// eslint-disable-next-line no-multi-assign
module.exports = ProfileSchool = Profile.discriminator(
  'ProfileSchool',
  ProfileSchoolSchema,
);
