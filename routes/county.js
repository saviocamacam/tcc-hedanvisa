const CountyRepresentant = require("../models/countyRepresentant");
const express = require("express");
const router = express.Router();

router.post("/representant", (req, res) => {
  var countyRepresentant = new CountyRepresentant({
    county: req.body.county,
    profile: req.body.profile
  });
  countyRepresentant.save((err, countyRepresentantSaved) => {
    if (err) throw err;
    if (countyRepresentantSaved) {
    }
  });
  res.send({
    status: 200,
    message: "county representand saved",
    success: true
  });
});

module.exports = router;
