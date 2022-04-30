const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../utils/authService");
const models = require("../models/index");

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    let event = await models.Event.create(req.body);
    res.status(201).json({
      success: true,
      message: "Event has been created",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
