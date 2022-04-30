var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProfessorClassroomSchema = new Schema(
  {
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom"
    },
    professor: {
      type: Schema.Types.ObjectId,
      ref: "ProfileProfessor"
    },
    assestments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document"
      }
    ],
    enteredAt: Date,
    exitedAt: Date,
    available: Boolean
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("ProfessorClassroom", ProfessorClassroomSchema);
