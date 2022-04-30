const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchoolYearClassrooms = new Schema(
  {
    schoolYear: {
      type: Schema.Types.ObjectId,
      ref: 'SchoolYear',
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'ProfileSchoolInstitutional',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'ProfileSchool',
    },
    classrooms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Classroom',
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

module.exports = mongoose.model('SchoolYearClassroom', SchoolYearClassrooms);
