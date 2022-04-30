const express = require("express");
const router = express.Router();
const { checkTokenMiddleware } = require("../../utils/authService");
const models = require("../../models/index");

router.get("/contact", checkTokenMiddleware, async (req, res) => {
  try {
    const contactFound = await models.Contact.find(req.query).populate({
      path: "user",
      model: "User",
      select: "profiles shortName",
      populate: [
        {
          path: "profiles",
          model: "ProfileStudent",
          select: "level serie school avatar bio",
          populate: {
            path: "school",
            model: "Link",
            select: "requested",
            populate: [
              {
                path: "requested",
                model: "ProfileSchoolInstitutional",
                select: "institution",
                populate: [
                  {
                    path: "institution",
                    model: "InstitutionSchool"
                  }
                ]
              }
            ]
          }
        },
        {
          path: "people",
          model: "People",
          select: "name _id"
        }
      ]
    });

    if (contactFound[0].user.profiles) {
      res.status(200).json({
        success: true,
        message: "Profile found",
        data: {
          name: contactFound[0].user.people.name,
          shortName: contactFound[0].user.shortName,
          profile: contactFound[0].user.profiles[0]
        }
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
    const profile = await models.Profile.findById(req.params._id)
      .populate({
        path: "school",
        model: "Link",
        populate: {
          path: "requested",
          model: "ProfileSchoolInstitutional",
          select: "avatar active",
          populate: [
            {
              path: "countyInstitutional",
              model: "ProfileCountyInstitutional",
              select: "name state_id"
            },
            {
              path: "institution",
              model: "Institution",
              select: "name"
            }
          ]
        }
      })
      .populate({
        path: "follow",
        model: "Follow"
      });

    if (profile) {
      res.status(200).json({
        success: true,
        message: "Profile has found",
        data: {
          profile
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "There was a problem getting the profile",
      error
    });
  }
});

router.post("/", checkTokenMiddleware, async (req, res) => {
  try {
    const user = await models.User.findById(req.body.user)
      .select("-password -__v")
      .populate({
        path: "people",
        model: "People",
        select: "name _id"
      })
      .populate({
        path: "profiles",
        model: "Profile",
        select: "_id type details"
      });
    if (user) {
      const newStudent = await new models.ProfileStudent({
        user: req.body.user,
        level: req.body.level,
        serie: req.body.serie,
        bio: req.body.bio
      });

      if (req.body.hasParent) {
        // link relationship Setup
        let parent = await models.ProfileParent.findById(req.body.parentId);
        let newLink = new models.Link({
          requested: parent._id,
          requesting: newStudent._id,
          status: "waiting"
        });
        await newLink.save();
        parent.childs.push(newLink);
        newStudent.relatives.push(newLink);

        //  followship Setup
        let followParent = await new models.Follow({
          followed: parent._id,
          following: newStudent._id
        });
        parent.follow.push(followParent);
        newStudent.follow.push(followParent);
        await parent.save();
        await followParent.save();
      }
      if (req.body.hasSchool) {
        let school = await models.ProfileSchoolInstitutional.findById(
          req.body.school
        );
        let followSchool = await new models.Follow({
          followed: school._id,
          following: newStudent._id
        });
        school.follow.push(followSchool);

        newStudent.follow.push(followSchool);
        await followSchool.save();

        let newLink = await new models.Link({
          requested: school._id,
          requesting: newStudent._id,
          status: "waiting"
        });

        school.students.push(newLink);
        newStudent.school = newLink;
        await newLink.save();
        await school.save();
      }
      await newStudent.save();

      // Se for o primeiro perfil, ele é o principal por padrão
      if (user.profiles.length === 0) {
        user.mainProfile = newStudent._id;
      }
      user.profiles.push(newStudent);
      await user.save();

      res.status(201).json({
        success: true,
        message: "Student profile has created.",
        data: {
          profile: newStudent
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found"
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

router.put("/", checkTokenMiddleware, async (req, res) => {
  try {
    const profile = await models.Profile.findById(req.body._id).populate({
      path: "school",
      model: "InstitutionSchool"
    });

    if (profile) {
      profile.update({
        user: req.body.user,
        level: req.body.level,
        serie: req.body.serie,
        school: req.body.school
      });
      res.status(200).json({
        success: true,
        message: "Profile Edited",
        data: {
          profile
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Profile not found"
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
