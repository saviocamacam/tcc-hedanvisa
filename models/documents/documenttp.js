var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocumenttpSchema = new Schema({
  initials: Schema.Types.String,
  name: Schema.Types.String,
  description: Schema.Types.String
});

module.exports = mongoose.model("Documenttp", DocumenttpSchema);
