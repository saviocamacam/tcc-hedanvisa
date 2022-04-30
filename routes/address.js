const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../utils/authService");
const models = require("../models/index");

router.get("/address-info", checkTokenMiddleware, async (req, res) => {
  try {
    const people = await models.People.findOne({
      _id: req.decoded.user.people
    });
    if (people.address) {
      const address = await models.Address.findOne({
        _id: people.address
      });
      res.status(200).json({
        success: true,
        message: "Address informations has found",
        data: {
          address
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User has no address registered"
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

router.post("/address-info", checkTokenMiddleware, async (req, res) => {
  try {
    address = await new models.Address({
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      block: req.body.block,
      cep: req.body.cep,
      county: req.body.county,
      uf: req.body.uf
    });
    address.peoples.push(req.decoded.user.people);
    await address.save();
    await models.People.findByIdAndUpdate(req.decoded.user.people, {
      address
    });
    res.status(201).json({
      success: true,
      message: "Address has created",
      data: {
        address
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error
    });
  }
});

router.put("/address-info", checkTokenMiddleware, async (req, res) => {
  try {
    const people = await models.People.findById(
      req.decoded.user.people
    ).populate({
      path: "address",
      model: "Address"
    });

    if (!people) {
      res.status(404).json({
        success: false,
        message: "People hasn't found."
      });
    }

    const address = people.address;

    if (!address) {
      res.status(404).json({
        success: false,
        message: "Address hasn't found."
      });
    }

    address.street = req.body.street;
    address.number = req.body.number;
    address.complement = req.body.complement;
    address.block = req.body.block;
    address.cep = req.body.cep;
    address.county = req.body.county;
    address.uf = req.body.uf;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address has updated",
      data: {
        address
      }
    });

    res.status(404).json({
      success: false,
      message: "Address not updated"
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
