const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Role = require('./role');

const RoleAdminSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "AdminProfile"
  }
});

module.exports = RoleSchool = Role.discriminator("RoleAdmin", RoleAdminSchema);