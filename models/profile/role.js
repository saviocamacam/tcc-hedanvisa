var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RoleSchema = new Schema(
  {
    name: {
      type: String
    },
    description: {
      type: String
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission"
      }
    ]
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

module.exports = mongoose.model("Role", RoleSchema);
