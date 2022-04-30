var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");
var People = require("../models/people");

var UserSchema = new Schema(
  {
    people: {
      type: Schema.Types.ObjectId,
      ref: "People"
      // unique: true,
      // required: true
    },
    mainPhone: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      unique: true,
      sparse: true
    },
    mainEmail: {
      type: Schema.Types.ObjectId,
      ref: "Contact",
      unique: true,
      sparse: true
    },
    mainProfile: {
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    profiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile"
      }
    ],

    shortName: {
      type: Schema.Types.String,
      required: true,
      unique: true
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    lastLogin: Schema.Types.Date,
    socket: {
      type: Schema.Types.String
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

UserSchema.pre("save", function(next) {
  var user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(passw) {
  return bcrypt.compare(passw, this.password);
};

module.exports = mongoose.model("User", UserSchema);
