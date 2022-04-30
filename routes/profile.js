const express = require("express");
const router = express.Router();
const {
  checkTokenMiddleware,
  generateFirebaseToken
} = require("../utils/authService");
const models = require("../models/index");

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message: message
  });
}

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    const profile = await models.Profile.findById(req.params._id).populate([
      {
        path: "user",
        model: "User",
        select: "people shortName",
        populate: [{ path: "people", model: "People", select: "name" }]
      },
      { path: "role", model: "Role" },
      {
        path: "classrooms",
        model: "Classroom",
        select: "series subClass shift"
      },
      {
        path: "school",
        model: "Link",
        populate: {
          path: "requested",
          model: "Profile",
          select: "institution countyInstitutional classrooms",
          populate: [
            {
              path: "institution",
              model: "Institution",
              select: "name"
            },
            {
              path: "countyInstitutional",
              model: "Profile",
              select: "name"
            }
          ]
        }
      },
      {
        path: "county",
        model: "Link",
        populate: {
          path: "requested",
          model: "Profile"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Profile was found",
      data: {
        profile
      }
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post("/:_id/event/", checkTokenMiddleware, async (req, res) => {
  try {
    let event = await models.Event.create(req.body);
    res.status(200).json({
      success: true,
      message: "Event has been created",
      data: event
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

module.exports = router;
