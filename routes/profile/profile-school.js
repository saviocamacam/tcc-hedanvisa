const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../../utils/authService");
const models = require("../../models/index");

router.get("/", checkTokenMiddleware, async (req, res) => {
  try {
    const schools = await models.ProfileSchool.find();

    if (schools) {
      res.status(200).json({
        success: true,
        message: "The Schools Profiles has found",
        data: {
          profiles: schools
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The Schools Profiles has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    const school = await models.ProfileSchool.findById(req.params._id);
    if (school) {
      res.status(200).json({
        success: true,
        message: "The School Profile has found",
        data: {
          profile: school
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The School Profile has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    const user = await models.User.findById(req.decoded.user._id)
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
    if (user) {
      const newRole = new models.RoleSchool({
        school: req.body.school,
        type: req.body.role
      });
      await newRole.save();
      delete req.body.role;

      const schoolInstitutional = await models.ProfileSchoolInstitutional.findById(
        req.body.school
      );
      delete req.body.school;
      let newSchool = await models.ProfileSchool.create({
        ...req.body
      });
      if (schoolInstitutional) {
        try {
          const newLink = new models.Link({
            requested: schoolInstitutional._id,
            requesting: newSchool._id,
            status: "waiting"
          });
          newSchool.school = newLink;
          await schoolInstitutional.school_managers.push(newLink);
          await newLink.save();
          await schoolInstitutional.save();
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: error.message,
            error
          });
        }
      }

      newSchool.role = newRole;
      await newSchool.save();

      if (user.profiles.length === 0) {
        user.mainProfile = newSchool._id;
      }
      await user.profiles.push(newSchool);
      await user.save();

      res.status(201).json({
        success: true,
        message: "The School Profile has been created.",
        data: {
          profile: newSchool
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/", checkTokenMiddleware, async (req, res) => {
  try {
    let school = await models.ProfileSchool.findById(req.body._id);

    if (school) {
      // Edit code

      res.status(200).json({
        success: true,
        message: "The School Profile has been updated",
        data: {
          profile: school
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The School Profile has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
