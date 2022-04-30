const express = require('express');
const DocumentModel = require('../models/documents/document');
const Profile = require('../models/profile/profile');

const router = express.Router();
const { checkTokenMiddleware } = require('../utils/authService');
const models = require('../models/index');

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message,
  });
}

router.post('/', checkTokenMiddleware, async (req, res) => {
  try {
    const owner = await Profile.findById(req.decoded.user.mainProfile).populate(
      {
        path: 'documents',
        model: 'Document',
      },
    );

    if (!owner) {
      res.status(404).json({
        success: false,
        message: 'Owner not found',
      });
    }

    const document = await DocumentModel.create({
      owner: req.decoded.user.mainProfile,
      meta: req.body.meta,
      content: req.body.content,
    });

    if (req.body.attachments) document.attachments = req.body.attachments;

    owner.documents.push(document);
    await owner.save();

    res.status(201).json({
      success: true,
      message: 'Document has been created',
      data: {
        document,
      },
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get('/', checkTokenMiddleware, async (req, res) => {
  try {
    const documents = await DocumentModel.find({
      owner: req.decoded.user.mainProfile,
    }).populate({
      path: 'documents',
      model: 'Document',
    });

    if (!documents) {
      res.status(404).json({
        success: false,
        message: 'Documents not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Documents has found',
      data: {
        documents,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/:_documentType/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const doc = await models.Document.findOne({
      _id: req.params._id,
      'meta.type': req.params._documentType,
    }).populate({
      path: 'owner',
      model: 'Profile',
      select: 'user school',
      populate: [
        {
          path: 'user',
          model: 'User',
          select: 'shortName people',
          populate: { path: 'people', model: 'People', select: 'name' },
        },
        {
          path: 'school',
          model: 'Link',
          select: 'requested',
          populate: {
            path: 'requested',
            model: 'Profile',
            select: 'institution',
            populate: {
              path: 'institution',
              model: 'Institution',
              select: 'name',
            },
          },
        },
      ],
    });

    if (doc) {
      res
        .status(200)
        .json({ success: true, message: 'DOCUMENT_FOUND', data: doc });
    } else {
      res.status(404).json({ success: true, message: 'DOCUMENT_NOT_FOUND' });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

module.exports = router;
