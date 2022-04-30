const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require("./role");

const RoleComunitySchema = new Schema({
  comunity: {
    type: Schema.Types.ObjectId,
    ref: "ProfileComunityInstitutional"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "ProfileAdmin"
  },
  type: String
});

module.exports = RoleComunity = Role.discriminator(
  "RoleComunity",
  RoleComunitySchema
);
