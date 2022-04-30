const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { checkTokenMiddleware } = require("../utils/authService");
const models = require("../models/index");

router.put("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    // models.Document.mapReduce();

    // let link = await models.Link.findByIdAndUpdate(req.params._id, req.body);
    const link = await models.Link.findOneAndUpdate(
      { _id: mongoose.mongo.ObjectId(req.params._id) },
      { $set: { status: req.body.status } },
      { new: true }
    );

    res.status(200).json({
      message: "Link has been updated",
      success: true,
      data: link
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
