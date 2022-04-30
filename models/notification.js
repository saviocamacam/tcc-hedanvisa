var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile"
  },
  via: {
    // tipo de meio usado para notificação: 'email' 'cellphone' 'app'
    type: Schema.Types.ObjectId,
    ref: "Contact",
    required: false
  },
  viewed: Schema.Types.Boolean,
  content: Schema.Types.String
}, {
  timestamps: {
    createdAt: "created_at"
  }
});

module.exports = mongoose.model("Notification", NotificationSchema);