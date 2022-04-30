const express = require("express");
const router = express.Router();

router.get("/institution", (req, res) => {
  res.send({
    message: "institutionGetRoute"
  });
});

module.exports = router;