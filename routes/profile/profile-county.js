const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const getUserById = require('./profile-commons');
const { checkTokenMiddleware } = require('../../utils/authService');
const models = require('../../models/index');

router.get('/', checkTokenMiddleware, async (req, res) => {
  try {
    const counties = await models.ProfileCounty.find();

    if (counties) {
      res.status(200).json({
        success: true,
        message: 'The Counties Profiles has found',
        data: {
          counties,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'The Counties Profiles has not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const county = await models.ProfileCounty.findById(req.params._id).populate(
      {
        path: 'county',
        model: 'Link',
        select: 'requested',
        populate: {
          path: 'requested',
          model: 'ProfileCountyInstitutional',
          select: 'county_managers',
          populate: {
            path: 'county_managers',
            model: 'Link',
            select: 'requesting',
            populate: {
              path: 'requesting',
              model: 'ProfileCounty',
              select: 'user',
              populate: {
                path: 'user',
                model: 'User',
                select: 'people',
                populate: {
                  path: 'people',
                  model: 'People',
                },
              },
            },
          },
        },
      },
    );

    if (county) {
      res.status(200).json({
        success: true,
        message: 'The County Profile has found.',
        data: {
          profile: county,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'The County Profile has not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/', checkTokenMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const opts = {
      session,
    };
    const user = await getUserById.getUserById(
      req.decoded.user._id,
      opts.session,
    );
    const countyInstitutional = await models.ProfileCountyInstitutional.findById(
      req.body.county,
    )
      // .session(opts.session)
      .select('county_managers');

    if (user && countyInstitutional) {
      const newCountyRole = await models.RoleCounty.create(
        {
          county: req.body.county,
          type: req.body.role,
        },
        // opts
      );
      const newCountyProfile = await models.ProfileCounty.create(
        { user: req.decoded.user._id, role: newCountyRole._id },
        // opts
      );

      try {
        const newLink = await models.Link.create(
          {
            requested: countyInstitutional._id,
            requesting: newCountyProfile._id,
          },
          // opts
        );
        newCountyProfile.county = newLink;
        await user.profiles.push(newCountyProfile);
        if ((await user.profiles.length) <= 1) { user.mainProfile = await newCountyProfile; }
        await user.save();
        await countyInstitutional.county_managers.push(newLink);
        await newCountyProfile.save();
        await countyInstitutional.save();

        // await session.commitTransaction();
        // session.endSession();

        res.status(201).json({
          success: true,
          message: 'The County Profile has been created.',
          data: {
            profile: newCountyProfile,
          },
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
          error,
        });
      }
    } else {
      // await session.abortTransaction();
      // session.endSession();
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.log(error);
    // await session.abortTransaction();
    // session.endSession();
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.put('/', checkTokenMiddleware, async (req, res) => {
  try {
    const county = await models.ProfileCounty.findById(req.body._id);
    if (county) {
      // Edit code

      res.status(200).json({
        success: true,
        message: 'The County Profile has been updated.',
        data: {
          profile: county,
        },
      });
    } else {
      req.status(404).json({
        success: false,
        message: 'The County Profile not found.',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
