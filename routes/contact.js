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

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    let user = await models.User.findById(req.body.user);
    let contact = await models.Contact.findOne({ address: req.body.address });

    if (user && !user.mainMail && !contact) {
      let contact = await models.Contact.create(req.body);
      await models.User.update(
        { _id: user._id },
        { $set: { mainEmail: contact._id } }
      );
      res.status(200).json({
        success: true,
        message: "Contact created successfully",
        data: { contact }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Contact not created"
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get("/contact-exists/:address", async (req, res) => {
  try {
    const contact = await models.Contact.findOne({
      address: req.params.address
    });

    if (contact) {
      res.status(200).json({
        success: true,
        message: "Contact has been founded.",
        data: {
          contactExists: true
        }
      });
    } else {
      res.status(404).json({
        success: true,
        message: "Contact hasn't found."
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

router.get(
  "/contact-is-checked/:address",
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const contact = await models.Contact.findOne({
        address: req.params.address
      });

      if (contact) {
        if (contact.checked) {
          res.status(200).json({
            success: true,
            message: "Contact is already checked.",
            data: {
              contactIsChecked: true
            }
          });
        } else {
          res.status(409).json({
            success: false,
            message: "Contact isn't checked."
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "Contact hasn't found."
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error
      });
    }
  }
);

module.exports = router;
