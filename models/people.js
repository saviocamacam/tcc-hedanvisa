var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var User = require("./user");

var PeopleSchema = new Schema(
  {
    name: Schema.Types.String,
    rg: Schema.Types.String,
    rg_uf: Schema.Types.String,
    cpf: Schema.Types.String,
    born: Schema.Types.Date,
    gender: Schema.Types.String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
      // unique: true,
      // required: true
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address"
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

// PeopleSchema.post("save", async function(doc, next) {
//   let people = this;
//   console.log(this);
//   console.log(User);
//   try {
//     await User.findByIdAndUpdate(people.user, {
//       people
//     });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("People", PeopleSchema);
