const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const { checkTokenMiddleware } = require('../utils/authService');
const models = require('../models/index');

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message,
  });
}

router.delete('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    await models.Classroom.updateOne(
      {
        frequencies: {
          $in: [mongoose.Types.ObjectId(req.params._id)],
        },
      },
      { $pull: { frequencies: mongoose.Types.ObjectId(req.params._id) } },
    );
    await models.Frequency.remove({ _id: req.params._id });
    res.status(200).json({
      success: true,
      message: 'Frequency was excluded.',
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.put('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const cloneBody = JSON.parse(JSON.stringify(req.body));
    delete cloneBody.date;
    delete cloneBody.content;
    delete cloneBody.obs;
    delete cloneBody.owner;
    delete cloneBody.revisors;
    delete cloneBody.meta;
    let frequency;
    if (req.body.revisors) {
      frequency = await models.Frequency.findByIdAndUpdate(req.params._id, {
        date: req.body.date,
        content: req.body.content,
        obs: req.body.obs,
        meta: req.body.meta,
        students: cloneBody,
        $push: {
          revisors: {
            profile: req.body.revisors,
            time: new Date().toISOString(),
          },
        },
      });
    } else {
      frequency = await models.Frequency.findByIdAndUpdate(req.params._id, {
        date: req.body.date,
        content: req.body.content,
        obs: req.body.obs,
        meta: req.body.meta,
        students: cloneBody,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Frequency has been updated',
      data: {
        frequency,
      },
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

module.exports = router;
