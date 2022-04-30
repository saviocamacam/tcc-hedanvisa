var mongoose = require("mongoose");
const User = require("./user");
var Schema = mongoose.Schema;

var ContactSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    profile: {
      // a princípio não é requerido um perfil pra criação de um contato
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    type: Schema.Types.String,
    address: { type: Schema.Types.String, unique: true },
    checked: {
      type: Schema.Types.Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

// ContactSchema.pre("save", async function(doc) {
//   console.log(doc);
// });

// ContactSchema.pre("post", async function(doc) {});

module.exports = mongoose.model("Contact", ContactSchema);
