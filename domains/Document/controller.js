const models = require('../../models');

module.exports = {
  async getAll(req, res) {
    try {
      const documents = await models.Document.find({
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

      return res.status(200).json({
        success: true,
        message: 'Documents has found',
        data: documents,
      });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getByType(req, res) {
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
      res.status(400).json({ message: error.message, data: null });
    }
  },
};
