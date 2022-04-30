const mongoose = require("mongoose");
const Profile = require("../profile/profile");
const User = require("../user");

const Schema = mongoose.Schema;

const LinkSchema = new Schema(
  {
    requested: {
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    requesting: {
      type: Schema.Types.ObjectId,
      ref: "Profile"
    },
    status: {
      type: String,
      enum: ["waiting", "accepted", "denied", "closed"],
      default: "waiting"
    }
  },
  {
    timestamps: {
      createdAt: "createdAt"
    }
  }
);

// Se não usar o true cria o Link mesmo sem chamar o next()

// LinkSchema.pre("save", function(next) {
//   const profileRequested = Profile.findById(this.requested);
//   const profileRequesting = Profile.findById(this.requesting);

//   Promise.all([profileRequested, profileRequesting]).then(
//     (profileRequested, profileRequesting) => {
//       this.model("Link")
//         .find({
//           requested: profileRequested
//         })
//         .populate({ path: "requesting", select: "user profileType" })
//         .exec((err, links) => {
//           links = links.filter(
//             link =>
//               link.requesting &&
//               link.requesting.profileType === profileRequesting.profileType &&
//               link.requesting.user.toString() ===
//                 profileRequesting.user.toString()
//           );

//           console.log("links.length", links.length);

//           if (links.length > 0) return next(new Error("repeated_profile"));
//           // else throw new Error("repeated_profile");
//           return next();
//         });
//     }
//   );
// });

function repeatedError() {
  return new Promise((resolve, reject) => {
    return reject(new Error("repeated_profile"));
  });
}

// LinkSchema.pre("save", true, async function(next) {
//   const profileRequested = await Profile.findById(this.requested);
//   const profileRequesting = await Profile.findById(this.requesting);

//   const linksBetweenUserAndRequested = await this.model("Link")
//     .find({
//       requested: profileRequested
//     })
//     .populate({ path: "requesting", select: "user profileType" })
//     .exec((err, links) => {
//       links = links.filter(
//         link =>
//           link.requesting &&
//           link.requesting.profileType === profileRequesting.profileType &&
//           link.requesting.user.toString() === profileRequesting.user.toString()
//       );

//       console.log("links.length", links.length);

//       if (links.length > 0) throw new Error("repeated_profile");
//       // else throw new Error("repeated_profile");
//       return next();
//     });
// });

LinkSchema.pre("save", function(next) {
  const profileRequestedPromise = Profile.findById(this.requested);
  const profileRequestingPromise = Profile.findById(this.requesting);

  Promise.all([profileRequestedPromise, profileRequestingPromise]).then(
    results => {
      const profileRequested = results[0];
      const profileRequesting = results[1];

      this.model("Link")
        .find({
          requested: profileRequested
        })
        .populate({ path: "requesting", select: "user profileType" })
        .then(linksBetweenUserAndRequested => {
          linksBetweenUserAndRequested = linksBetweenUserAndRequested.filter(
            link =>
              link.requesting &&
              link.requesting.profileType === profileRequesting.profileType &&
              link.requesting.user.toString() ===
                profileRequesting.user.toString()
          );

          console.log("sizezera", linksBetweenUserAndRequested.length);

          if (linksBetweenUserAndRequested.length > 0)
            return next(new Error("repeated_profile"));

          console.log("chamando next");
          return next();
        });
    }
  );
});

LinkSchema.post("findOneAndUpdate", async function(doc) {
  const io = global.io;

  const profile = await Profile.findById(doc.requesting);

  if (profile) {
    const user = await User.findById(profile.user);
    if (user && user.socket) {
      const socket = io.clients().sockets[user.socket];
      if (socket) {
        socket.emit("update-profiles");
      }
    }
  }
});

module.exports = mongoose.model("Link", LinkSchema);
