var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EnrollmentClassroomSchema = new Schema(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom"
    },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment"
    },
    enteredAt: Schema.Types.Date,
    exitedAt: Schema.Types.Date,
    available: Schema.Types.Boolean
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model(
  "EnrollmentClassroom",
  EnrollmentClassroomSchema
);
