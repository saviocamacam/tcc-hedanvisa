const mongoose = require('mongoose');

const { Schema } = mongoose;

const ClassroomSchema = new Schema(
  {
    professors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Link',
      },
    ],
    school: { type: Schema.Types.ObjectId, ref: 'ProfileSchoolInstitutional' },
    external_id: Schema.Types.String,
    series: Schema.Types.String,
    shift: Schema.Types.String,
    course: Schema.Types.String,
    subClass: Schema.Types.String,
    hour: Schema.Types.String,
    days: Object,
    year: {
      type: Schema.Types.ObjectId,
      ref: 'SchoolYearClassroom',
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Enrollment',
      },
    ],
    frequencies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Frequency',
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    evaluativeMatrixes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EvaluativeMatrix',
        required: true,
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
  },
);

// ClassroomSchema.pre("save", async function(doc) {
//   const io = global.io;
//   // const profile = await Profile.findById(doc.requesting);

//   // if (profile) {
//   //   const user = await User.findById(profile.user);
//   //   if (user && user.socket) {
//   //     const socket = io.clients().sockets[user.socket];
//   //     if (socket) {
//   //       socket.emit("update-profiles");
//   //     }
//   //   }
//   // }
// });

module.exports = mongoose.model('Classroom', ClassroomSchema);
