var mongoose = require("mongoose");
const competence = require("../models/competence");
var FundamentalCompetence = competence.fundamental;
var InfantCompetence = competence.infant;
const express = require("express");
const router = express.Router();

const { checkTokenMiddleware } = require("../utils/authService");

router.get("/hability", checkTokenMiddleware, async (req, res) => {
  try {
    let habilities = await FundamentalCompetence.find(req.query);
    res.status(200).json({
      succes: true,
      message: "Habilities found",
      data: {
        habilities: habilities
      }
    });
  } catch (error) {
    res.status(400).json({
      succes: false,
      message: error.message
    });
  }
});

module.exports = router;
