var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SchoolYear = new Schema({
  year: {
    type: Schema.Types.Date,
    required: true,
    unique: true
  },
  county: {
    type: Schema.Types.ObjectId,
    ref: "ProfileCountyInstitutional",
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "ProfileCounty",
    required: true
  },
  regime: {
    type: Schema.Types.String,
    enum: ["bi", "tri", "sem"],
    required: true
  },
  periods: [{
    type: Schema.Types.ObjectId,
    ref: "Period",
    max: function () {
      if (this.regime == "bi") {
        return 4;
      } else if (this.regime == "tri") {
        return 3;
      } else if (this.regime == "sem") {
        return 2;
      } else {
        return 0;
      }
    }
  }],
  attachments: [{
    type: Schema.Types.ObjectId,
    ref: "Document"
  }]

}, {
  timestamps: {
    createdAt: "createdAt"
  }
});

module.exports = mongoose.model("SchoolYear", SchoolYear);