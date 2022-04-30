const mongoose = require('mongoose');

const { Schema } = mongoose;
const Profile = require('./profile');

const ProfileCountySchema = new Schema({
  county: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'RoleCounty',
  },
  showType: {
    type: String,
    default: 'Gestão de Rede',
  },
});

module.exports = ProfileCounty = Profile.discriminator(
  'ProfileCounty',
  ProfileCountySchema,
);
