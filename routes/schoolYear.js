const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../utils/authService");
const models = require("../models/index");

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message: message
  });
}

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    let schoolYear = await models.SchoolYear.findById(req.params._id).populate({
      path: "periods",
      model: "Period",
      populate: [
        {
          path: "start",
          model: "Event"
        },
        {
          path: "end",
          model: "Event"
        }
      ]
    });
    res.status(200).json({
      success: true,
      message: "School year has been found",
      data: schoolYear
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get("/", checkTokenMiddleware, async (req, res) => {
  try {
    let schoolYears = await models.SchoolYear.find(req.query)
      .populate({
        path: "periods",
        model: "Period",
        populate: [
          {
            path: "start",
            model: "Event"
          },
          {
            path: "end",
            model: "Event"
          }
        ]
      })
      .populate({
        path: "attachments",
        model: "Document"
      });
    res.status(200).json({
      success: true,
      message: "School Years have been found",
      data: schoolYears
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.put("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    models.SchoolYear;
    let year = await models.SchoolYear.findByIdAndUpdate(
      req.params._id,
      req.body
    ).populate({
      path: "attachments",
      model: "Document"
    });

    res.status(200).json({
      success: true,
      message: "School Year has been updated",
      data: year
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.put("/:_id/add_attachments", checkTokenMiddleware, async (req, res) => {
  try {
    // models.SchoolYear;
    // let year = await models.SchoolYear.findByIdAndUpdate(
    //   req.params._id,
    //   req.body
    // );

    let year = await models.SchoolYear.findById(req.params._id).populate({
      path: "attachments",
      model: "Document"
    });

    let attachment = await models.Document.findById(req.body.attachment);

    await year.attachments.push(attachment);

    await year.save();

    res.status(200).json({
      success: true,
      message: "School Year has been updated",
      data: {
        year
      }
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    models.SchoolYear;
    let year = await models.SchoolYear.create(req.body);
    await models.ProfileCountyInstitutional.findByIdAndUpdate(req.body.county, {
      $push: {
        schoolYears: year._id
      }
    });
    res.status(201).json({
      success: true,
      message: "School Year has been created",
      data: year
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get("/from_owner/:owner", checkTokenMiddleware, async (req, res) => {
  try {
    const schoolYears = await models.SchoolYear.find({
      createdBy: req.params.owner
    }).populate({
      path: "attachments",
      model: "Documents"
    });

    if (!schoolYears) {
      res.status(404).json({
        success: false,
        message: "schoolYears from owner hasn't found."
      });
    }

    res.status(200).json({
      success: true,
      message: "schoolYears from owner has found.",
      date: {
        schoolYears
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

module.exports = router;
