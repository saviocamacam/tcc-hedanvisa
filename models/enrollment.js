const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema(
  {
    basic: Object,
    contato: Object,
    endereco: Object,
    filiacao: Object,
    classrooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Classroom"
      }
    ],
    profileStudent: {
      type: Schema.Types.ObjectId,
      ref: "Link"
    },
    parents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Link",
        max: 3
      }
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

EnrollmentSchema.plugin(paginate);

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
