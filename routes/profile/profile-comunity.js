const express = require("express");
const router = express.Router();
const getUserById = require("./profile-commons");
const { checkTokenMiddleware } = require("../../utils/authService");
const models = require("../../models/index");

router.get("/", checkTokenMiddleware, async (req, res) => {
  try {
    const comunities = await models.ProfileComunity.find();

    if (comunities) {
      res.status(200).json({
        success: true,
        message: "The Comunities Profiles has found"
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The Comunities Profiles has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error
    });
  }
});

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    const comunity = await models.ProfileComunity.findById(req.params._id);

    if (comunity) {
      res.status(200).json({
        success: true,
        message: "The Comunity Profile has found.",
        data: {
          profile: comunity
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The Comunity Profile has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error
    });
  }
});

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    let user = await getUserById.getUserById(req.decoded.user._id);
    let countyInstitutional = await models.ProfileCountyInstitutional.findById(
      req.body.county
    );

    delete req.body.county;
    let comunity = await models.ProfileComunity.create({
      ...req.body
    });

    let newRole = await models.RoleComunity.create({
      type: req.body.type
    });

    comunity.role = newRole;

    if (user.profiles.length === 0) {
      user.mainProfile = comunity._id;
    }
    user.profiles.push(comunity);

    let follow = await models.Follow.create({
      followed: countyInstitutional._id,
      following: comunity._id
    });
    comunity.follow.push(follow);
    countyInstitutional.follow.push(follow);

    let newLink = await models.Link.create({
      requested: countyInstitutional._id,
      requesting: comunity._id
    });
    comunity.county = newLink._id;

    if (req.body.voluntary) {
      await models.ProfileCountyInstitutional.findByIdAndUpdate(
        countyInstitutional._id,
        { $push: { voluntaries: newLink._id } }
      );
    }
    await comunity.save();
    await countyInstitutional.save();
    await user.save();
    res.status(201).json({
      success: true,
      message: "The Comunity Profile has been created.",
      data: {
        profile: comunity
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error
    });
  }
});

router.put("/", checkTokenMiddleware, async (req, res) => {
  try {
    let comunity = await models.ProfileComunity.findById(req.body._id);
    if (comunity) {
      // Edit code

      res.status(200).json({
        success: true,
        message: "The Comunity Profile has been updated.",
        data: {
          profile: comunity
        }
      });
    } else {
      req.status(404).json({
        success: false,
        message: "The Comunity Profile not found."
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error
    });
  }
});

module.exports = router;
