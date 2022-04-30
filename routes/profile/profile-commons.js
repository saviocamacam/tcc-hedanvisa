const User = require("../../models/user");

module.exports = {
  getUserById: async function getUserById(id, session) {
    return await User.findById(id)
      // .session(session)
      .select("-password -__v")
      .populate({
        path: "people",
        model: "People",
        select: "name _id"
      })
      .populate({
        path: "profiles",
        model: "Profile",
        select: "_id type details"
      });
  }
};
