const mongoose = require('mongoose');

const { Schema } = mongoose;
const Profile = require('./profile');

const ProfileSchoolInstitutionalSchema = new Schema({
  countyInstitutional: {
    type: Schema.Types.ObjectId,
    ref: 'ProfileCountyInstitutional',
  },
  inep_properties: {
    type: Object,
  },
  institution: {
    type: Schema.Types.ObjectId,
    ref: 'InstitutionSchool',
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Link',
  }],
  professors: [{
    type: Schema.Types.ObjectId,
    ref: 'Link',
  }],
  school_managers: [{
    type: Schema.Types.ObjectId,
    ref: 'Link',
  }],
  showType: {
    type: String,
    default: 'Perfil Institucional da Escola',
  },
  schoolYearClassrooms: [{
    type: Schema.Types.ObjectId,
    ref: 'SchoolYearClassroom',
  }],
  currentYear: {
    type: Schema.Types.ObjectId,
    ref: 'SchoolYear',
  },
});

module.exports = Profile.discriminator(
  'ProfileSchoolInstitutional',
  ProfileSchoolInstitutionalSchema,
);
