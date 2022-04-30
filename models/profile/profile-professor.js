const mongoose = require('mongoose');

const { Schema } = mongoose;
const Profile = require('./profile');

const ProfileProfessorSchema = new Schema({
  serie: {
    type: Schema.Types.String,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: 'Link',
  },
  level: {
    type: Schema.Types.String,
    enum: ['infantil', 'f1', 'f2', 'medio', 'mediot', 'superior'],
  },
  showType: {
    type: Schema.Types.String,
    default: 'Professor(a)',
  },
  subjects: [
    {
      type: Schema.Types.String,
    },
  ],
  classrooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
    },
  ],
});

module.exports = Profile.discriminator(
  'ProfileProfessor',
  ProfileProfessorSchema,
);
