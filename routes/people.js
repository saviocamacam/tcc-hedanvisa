const express = require("express");
const router = express.Router();
const { checkTokenMiddleware, generateToken } = require("../utils/authService");
const models = require("../models/index");

router.get("/people-info", checkTokenMiddleware, async (req, res) => {
  try {
    const people = await models.People.findOne({
      user: req.decoded.user._id
    })
      .populate({
        path: "user",
        model: "User"
      })
      .populate({
        path: "address",
        model: "Address",
        math: {
          _id: {
            $ne: null
          }
        }
      });
    if (people) {
      res.status(200).json({
        success: true,
        message: "People informations has found",
        data: {
          people
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "People not found"
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

router.post("/people-info", checkTokenMiddleware, async (req, res) => {
  try {
    const people = await models.People.create({
      name: req.body.name,
      born: req.body.born,
      gender: req.body.gender,
      rg: req.body.rg,
      rg_uf: req.body.rg_uf,
      cpf: req.body.cpf,
      user: req.decoded.user._id
    });

    await models.User.findByIdAndUpdate(people.user, {
      people
    });

    const newUser = await models.User.findOne({
      _id: req.decoded.user._id
    });

    const user = newUser.toJSON();

    delete user.password;
    delete user.__v;

    const payload = {
      user: {
        ...user
      }
    };

    res.status(201).json({
      success: true,
      message: "People has created",
      data: {
        people,
        token: generateToken(payload)
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

router.put("/people-info", checkTokenMiddleware, async (req, res) => {
  try {
    let people = await models.People.findOne({
      user: req.decoded.user._id
    }).populate({
      path: "address",
      model: "Address",
      math: {
        _id: {
          $ne: null
        }
      }
    });

    if (people) {
      people.name = req.body.name;
      people.born = req.body.born;
      people.gender = req.body.gender;
      people.rg = req.body.rg;
      people.rg_uf = req.body.rg_uf;
      people.cpf = req.body.cpf;
      await people.save();

      const newUser = await models.User.findOne({
        _id: req.decoded.user._id
      });

      const user = newUser.toJSON();

      delete user.password;
      delete user.__v;

      const payload = {
        user: {
          ...user
        }
      };

      res.status(200).json({
        success: true,
        message: "People has updated",
        data: {
          people,
          token: generateToken(payload)
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "People not found"
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error
    });
  }
});

module.exports = router;
