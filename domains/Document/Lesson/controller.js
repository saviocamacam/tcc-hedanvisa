const { Types } = require('mongoose');
const models = require('../../../models');


module.exports = {
  async delete(req, res) {
    try {
      const doc = await models.Document.findOneAndRemove({
        _id: req.params._id,
      });
      if (doc) {
        res.status(200).json({
          success: true,
          message: 'QUESTION_DELETED',
          data: doc,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'QUESTION_NOT_FOUND',
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getAll(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getById(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getByOwner(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getBySchool(req, res) {
    try {
      const { _id } = req.params;
      let authorizeds = await models.Link.aggregate([
        { $match: { requested: Types.ObjectId(_id) } },
        {
          $lookup: {
            from: 'profiles',
            localField: 'requesting',
            foreignField: '_id',
            as: 'profile',
          },
        }, {
          $unwind: {
            path: '$profile',
          },
        }, {
          $lookup: {
            from: 'users',
            localField: 'profile.user',
            foreignField: '_id',
            as: 'profile.user',
          },
        }, {
          $unwind: {
            path: '$profile.user',
          },
        }, {
          $project: {
            status: 1,
            requesting: 1,
            createdAt: 1,
            updatedAt: 1,
            user: '$profile.user',
            profile: 1,
          },
        }, {
          $lookup: {
            from: 'peoples',
            localField: 'user.people',
            foreignField: '_id',
            as: 'people',
          },
        }, {
          $unwind: {
            path: '$people',
          },
        }, {
          $project: {
            requesting: 1,
          },
        },
      ]);

      authorizeds = authorizeds.map(({ requesting }) => `${requesting}`);

      const documents = await models.Document.find({ owner: { $in: authorizeds }, 'meta.type': 'DailyPlanning', 'meta.forked': { $exists: false } }).populate({
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

      return res.status(200).json({ message: 'SUCCESS', data: documents });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getBySchoolSystem(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async getVersions(req, res) {
    try {
      res.status(200).json({ message: 'SUCCESS', data: null });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async fork(req, res) {
    try {
      const { _id, profile, version } = req.body;
      const lesson = await models.Document.findById(_id).then((doc) => {
        const a = doc.getVersion(version);
        return a;
      });
      let dupLesson = JSON.parse(JSON.stringify(lesson));
      delete dupLesson._id;
      delete dupLesson.updatedAt;
      delete dupLesson.createdAt;
      dupLesson.owner = profile;
      const forked = { _id: lesson._id, owner: lesson.owner, version };
      dupLesson.meta.forked = forked;
      dupLesson = await models.Document.create(dupLesson);
      res.status(201).json({ message: 'SUCCESS', data: dupLesson });
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async pull(req, res) {
    try {
      const waiting = await models.PullRequest.findOne({ _id: req.params._id, status: 'waiting' });
      if (waiting) {
        const { pullingVersion, pulled, pulling } = waiting;
        const lessonPulling = await models.Document.findById(pulling).then((doc) => {
          const a = doc.getVersion(pullingVersion);
          return a;
        });
        delete lessonPulling.meta.forked;
        const lessonPulled = await models.Document.findById(pulled).then((doc) => doc.set({ content: lessonPulling.content, meta: lessonPulling.meta }).save());
        await models.PullRequest.findOneAndUpdate({ _id: req.params._id, status: 'waiting' }, { $set: { status: 'accepted', pulledVersion: lessonPulled.documentVersion } });
        res.status(201).json({ message: 'SUCCESS', data: lessonPulled });
      } else {
        res.status(400).json({ message: 'PULL_NOT_FOUND', data: null });
      }
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },

  async pullRequest(req, res) {
    try {
      const {
        pullingVersion, pulled, pulling, why, from,
      } = req.body;

      const waiting = await models.PullRequest.find({ pulled, status: 'waiting' });
      if (waiting.length > 0) {
        res.status(400).json({ message: 'PULLDED_WAITING', data: null });
      } else {
        const pull = await models.PullRequest.create({
          pulling, pulled, pullingVersion, why, from,
        });

        res.status(201).json({ message: 'SUCCESS', data: pull });
      }
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },
  async denyPull(req, res) {
    try {
      const waiting = await models.PullRequest.findOne({ _id: req.params._id, status: 'waiting' });
      if (!waiting) {
        res.status(400).json({ message: 'PULL_NOT_FOUND', data: null });
      } else {
        const pull = await models.PullRequest.findOneAndUpdate({ _id: req.params._id }, { $set: { status: 'denied' } });
        res.status(201).json({ message: 'SUCCESS', data: pull });
      }
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },
  async deletePull(req, res) {
    try {
      const waiting = await models.PullRequest.findOne({ _id: req.params._id, status: 'waiting' });
      if (!waiting) {
        res.status(400).json({ message: 'PULL_NOT_FOUND', data: null });
      } else {
        const pull = await models.PullRequest.findOneAndRemove({ _id: req.params._id });
        res.status(201).json({ message: 'SUCCESS', data: pull });
      }
    } catch (error) {
      res.status(400).json({ message: error.message, data: null });
    }
  },
};
