const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../../utils/authService");
const models = require("../../models/index");

router.get("/", checkTokenMiddleware, async (req, res) => {
  try {
    const parents = await models.ProfileParent.find();

    if (parents) {
      res.status(200).json({
        success: true,
        message: "The Parents Profiles has found",
        data: {
          profiles: parents
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The Parents Profiles has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/contact", checkTokenMiddleware, async (req, res) => {
  try {
    const result = await Promise.all([
      models.Contact.findOne(req.query).populate({
        path: "user",
        model: "User",
        select: "profiles shortName",
        populate: [
          {
            path: "profiles",
            model: "ProfileParent"
          },
          {
            path: "people",
            model: "People",
            select: "name _id"
          }
        ]
      }),
      models.User.findOne({
        shortName: req.query.address
      })
        .select("+profiles")
        .populate([
          {
            path: "profiles",
            model: "ProfileParent"
          },
          {
            path: "people",
            model: "People",
            select: "name _id"
          }
        ])
    ]);

    if (result[0]) {
      res.status(200).json({
        success: true,
        message: "Profile found",
        data: {
          name: result[0].user.people.name,
          shortName: result[0].user.shortName,
          profile: result[0].user.profiles[0]
        }
      });
    } else if (result[1]) {
      res.status(200).json({
        success: true,
        message: "Profile found",
        data: {
          name: result[1].people.name,
          profile: result[1].profiles[0]
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No profile found"
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

router.get("/:_id", checkTokenMiddleware, async (req, res) => {
  try {
    const parent = await models.ProfileParent.findById(req.params._id);

    if (parend) {
      res.status(200).json({
        success: true,
        message: "The Parent Profile has found",
        data: {
          profile: parent
        }
      });
    } else {
      res.status(404).json({
        sucess: false,
        message: "The Parent Profile has not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    const user = await models.User.findById(req.body.user);
    if (user) {
      const newParent = new models.ProfileParent({
        user: req.body.user,
        kinship: req.body.kinship
      });

      if (req.body.hasChilds) {
        const student = await models.ProfileStudent.findById(req.body.childId);
        const newLink = new models.Link({
          requested: req.body.childId,
          requesting: newParent._id,
          status: "waiting"
        });
        student.relatives.push(newLink);
        await newParent.childs.push(newLink);
        await newLink.save();
      }
      await newParent.save();
      // Se for o primeiro perfil, ele é o principal por padrão
      if (user.profiles.length === 0) {
        user.mainProfile = newParent._id;
      }
      await user.profiles.push(newParent);
      await user.save();

      res.status(201).json({
        success: true,
        message: "Parent profile has created.",
        data: {
          newParent
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found"
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

router.put("/", checkTokenMiddleware, async (req, res) => {
  try {
    let parent = await models.ProfileParent.findById(req.body._id);

    if (parent) {
      // Edit Code

      res.status(200).json({
        success: true,
        message: "The Parent Profile has been updated",
        data: {
          profile: parent
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "The Parent Profile has not found"
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

module.exports = router;
