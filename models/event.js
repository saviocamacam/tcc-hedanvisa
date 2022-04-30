var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    start: {
      type: Schema.Types.Date,
      required: true
    },
    end: {
      type: Schema.Types.Date
    },
    allDay: {
      type: Schema.Types.Boolean
    },
    invited: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile"
      }
    ],
    local: [{}],
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Event", EventSchema);
