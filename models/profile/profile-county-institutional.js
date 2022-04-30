const mongoose = require('mongoose');

const { Schema } = mongoose;
const Profile = require('./profile');

const ProfileCountyInstitutionalSchema = new Schema({
  name: String,
  external_id: String,
  state_id: String,
  regime: {
    type: Schema.Types.String,
    enum: ['bi', 'tri', 'sem'],
  },
  onwer: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
  },
  available: {
    type: Boolean,
    default: false,
  },
  schools: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProfileSchoolInstitutional',
    },
  ],
  county_managers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Link',
    },
  ],
  showType: {
    type: String,
    default: 'Perfil Municipal Institucional',
  },
  voluntaries: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
  },
  schoolYears: [{ type: Schema.Types.ObjectId, ref: 'SchoolYear' }],
  currentYear: {
    type: Schema.Types.ObjectId,
    ref: 'SchoolYear',
  },
});

module.exports = Profile.discriminator(
  'ProfileCountyInstitutional',
  ProfileCountyInstitutionalSchema,
);
