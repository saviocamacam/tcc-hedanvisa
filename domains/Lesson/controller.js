const { Types } = require('mongoose');
const models = require('../../models');
const responses = require('../../utils/responses');
const {
  paginate,
  addFields,
  makeLookup,
  countAttachsTypes,
} = require('../../utils/aggregations');

module.exports = {
  async add(req, res, next) {
    try {
      const { session } = req;
      const { requesting } = req.headers;
      const {
        publicCounty,
        publicSchool,
        county,
        school,
        ...values
      } = req.body;

      const document = await new models.DocumentLesson({
        owner: requesting,
        ...values,
      }).save({
        session,
      });

      if (publicCounty) {
        const countyFound = await models.Profile.findById(county, null, {
          session,
        });
        if (!countyFound) {
          throw new Error('COUNTY_NOT_FOUND');
        }
        await models.PublicContentCounty.create([{ document, county }], {
          session,
        });
      }
      if (publicSchool) {
        const schoolFound = await models.Profile.findById(school, null, {
          session,
        });
        if (!schoolFound) {
          throw new Error('SCHOOL_NOT_FOUND');
        }
        await models.PublicContentSchool.create([{ document, school }], {
          session,
        });
      }

      res.status(responses.codes.SUCCESS).json({
        message: responses.messages.SUCCESS,
        data: document,
      });
      next();
    } catch (error) {
      if (error.message === 'COUNTY_NOT_FOUND') {
        res.status(responses.codes.NOT_FOUND).json({
          message: 'COUNTY_NOT_FOUND',
          data: null,
        });
      }
      if (error.message === 'SCHOOL_NOT_FOUND') {
        res.status(responses.codes.NOT_FOUND).json({
          message: 'SCHOOL_NOT_FOUND',
          data: null,
        });
      }
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const { session } = req;
      const { pagination, ...query } = req.query;
      const { requesting } = req.headers;
      query.owner = requesting;

      const result = await paginate(
        models.DocumentLesson,
        pagination,
        { session },
        [
          addFields([{ type: 'String', prop: 'owner' }]),
          addFields([{ type: 'String', prop: 'discipline' }]),
          { $match: query },
          addFields([{ type: 'ObjectId', prop: 'owner' }]),
          addFields([{ type: 'ObjectId', prop: 'discipline' }]),
          ...makeLookup('profiles', 'owner', '_id', 'ownerAsObject', true),
          ...makeLookup('publiccontents', '_id', 'document', 'publish', false),
          ...makeLookup(
            'users',
            'ownerAsObject.user',
            '_id',
            'userAsObject',
            true,
          ),
          ...makeLookup(
            'peoples',
            'userAsObject.people',
            '_id',
            'peopleAsObject',
            true,
          ),
          ...makeLookup(
            'disciplines',
            'discipline',
            '_id',
            'disciplineAsObject',
            true,
          ),
          ...countAttachsTypes(),
          {
            $addFields: {
              ownerName: {
                $concat: [
                  '$peopleAsObject.name',
                  ' (',
                  '$userAsObject.shortName',
                  ') ',
                ],
              },
            },
          },
          { $unset: ['userAsObject', 'peopleAsObject', 'ownerAsObject'] },
          { $sort: { createdAt: -1 } },
        ],
      );

      res.status(responses.codes.SUCCESS).json({
        message: responses.messages.SUCCESS,
        ...result,
      });
      next();
    } catch (error) {
      next(error);
    }
  },

  async getBySchool(req, res, next) {
    try {
      const { session } = req;
      const { pagination, ...query } = req.query;
      const { schoolId } = req.params;

      const result = await paginate(
        models.PublicContent,
        pagination,
        { session },
        [
          {
            $match: {
              __t: 'PublicContentSchool',
              status: 'accepted',
              school: Types.ObjectId(schoolId),
              ...query,
            },
          },
          ...makeLookup(
            'documents',
            'document',
            '_id',
            'documentAsObject',
            true,
          ),
          {
            $match: {
              'documentAsObject.__t': 'DocumentLesson',
            },
          },
          ...makeLookup(
            'profiles',
            'documentAsObject.owner',
            '_id',
            'ownerAsObject',
            true,
          ),
          ...makeLookup(
            'users',
            'ownerAsObject.user',
            '_id',
            'userAsObject',
            true,
          ),
          ...makeLookup(
            'peoples',
            'userAsObject.people',
            '_id',
            'peopleAsObject',
            true,
          ),
          ...makeLookup(
            'disciplines',
            'documentAsObject.discipline',
            '_id',
            'documentAsObject.disciplineAsObject',
            true,
          ),
          {
            $addFields: {
              publishCreatedAt: '$createdAt',
              publishUpdatedAt: '$updatedAt',
              ownerName: {
                $concat: [
                  '$peopleAsObject.name',
                  ' (',
                  '$userAsObject.shortName',
                  ') ',
                ],
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: { $mergeObjects: ['$$ROOT', '$$ROOT.documentAsObject'] },
            },
          },
          ...countAttachsTypes(),
          {
            $unset: [
              'userAsObject',
              'peopleAsObject',
              'ownerAsObject',
              'documentAsObject',
            ],
          },
          { $sort: { createdAt: -1 } },
        ],
      );

      res.status(responses.codes.SUCCESS).json({
        message: responses.messages.SUCCESS,
        ...result,
      });
      next();
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { session } = req;
      const { lessonId } = req.params;

      const [lesson] = await models.DocumentLesson.aggregate([
        { $match: { _id: Types.ObjectId(lessonId) } },
        ...makeLookup('profiles', 'owner', '_id', 'ownerAsObject', true),
        ...makeLookup(
          'users',
          'ownerAsObject.user',
          '_id',
          'userAsObject',
          true,
        ),
        ...makeLookup(
          'peoples',
          'userAsObject.people',
          '_id',
          'peopleAsObject',
          true,
        ),
        ...makeLookup(
          'disciplines',
          'discipline',
          '_id',
          'disciplineAsObject',
          true,
        ),
        ...makeLookup('publiccontents', '_id', 'document', 'publish', false),
        ...countAttachsTypes(),
        {
          $addFields: {
            ownerName: {
              $concat: [
                '$peopleAsObject.name',
                ' (',
                '$userAsObject.shortName',
                ') ',
              ],
            },
          },
        },
        { $unset: ['userAsObject', 'peopleAsObject', 'ownerAsObject', 'data'] },
      ]).option({ session });

      res.status(responses.codes.SUCCESS).json({
        message: responses.messages.SUCCESS,
        data: lesson,
      });
      next();
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { session } = req;
      const { lessonId } = req.params;

      const lesson = await models.DocumentLesson.findOneAndDelete({
        _id: Types.ObjectId(lessonId),
      }).session(session);

      if (!lesson) throw new Error('LESSON_NOT_FOUND');

      await models.PublicContent.deleteMany({ document: lesson._id });

      res.status(responses.codes.SUCCESS).json({
        message: responses.messages.SUCCESS,
        data: lesson,
      });
      next();
    } catch (error) {
      if (error.message === 'LESSON_NOT_FOUND') {
        res.status(responses.codes.NOT_FOUND).json({
          message: 'LESSON_NOT_FOUND',
          data: null,
        });
      }
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { session } = req;
      const { lessonId } = req.params;
      const {
        publicCounty,
        publicSchool,
        county,
        school,
        ...values
      } = req.body;

      const document = await models.DocumentLesson.findByIdAndUpdate(
        lessonId,
        values,
        {
          session,
        },
      );

      if (!document) throw new Error('LESSON_NOT_FOUND');

      if (!publicCounty) {
        await models.PublicContent.deleteMany({
          document: document._id,
        });
      } else {
        const countyDocument = await models.PublicContent.findOne(
          { document, county: Types.ObjectId(county) },
          null,
          { session },
        );
        if (!countyDocument) {
          await models.PublicContentCounty.create([{ document, county }], {
            session,
          });
        }
      }
      if (!publicSchool) {
        await models.PublicContent.deleteMany({
          __t: 'PublicContentSchool',
          document: document._id,
        });
      } else {
        const schoolDocument = await models.PublicContent.findOne(
          { document, school: Types.ObjectId(school) },
          null,
          { session },
        );
        if (!schoolDocument) {
          await models.PublicContentSchool.create([{ document, school }], {
            session,
          });
        }
      }

      res.status(responses.codes.SUCCESS).json({
        message: responses.messages.SUCCESS,
        data: document,
      });
      next();
    } catch (error) {
      if (error.message === 'LESSON_NOT_FOUND') {
        res.status(responses.codes.NOT_FOUND).json({
          message: 'LESSON_NOT_FOUND',
          data: null,
        });
      }
      next(error);
    }
  },

  async getDocumentByVersion(req, res, next) {
    try {
      const { compare } = req.query;
      const { _idPlanning } = req.params;
      const planning = await models.Document.findOne({
        _id: _idPlanning,
        'meta.type': 'DailyPlanning',
      })
        .populate([
          {
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
          },
          {
            path: 'meta.forked.owner',
            model: 'Profile',
            select: 'user school',
            populate: [
              {
                path: 'user',
                model: 'User',
                select: 'shortName people',
                populate: { path: 'people', model: 'People', select: 'name' },
              },
            ],
          },
        ])
        .then(async (doc) => {
          const a = await doc.getVersion(req.params.version);
          a.owner = doc.owner;
          return a;
        });
      // const compare = null;
      let compareVersion = null;

      if (compare) {
        compareVersion = await models.Document.findOne({
          _id: req.params._idPlanning,
          'meta.type': 'DailyPlanning',
        }).then((doc) => doc.getVersion(compare));
      }
      // console.log(planning.meta);
      if (planning) {
        res.status(200).json({
          success: true,
          message: 'Planning found',
          data: planning,
          compare: compareVersion,
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Planning not found',
        });
      }
    } catch (error) {
      if (error.message === 'LESSON_NOT_FOUND') {
        res.status(responses.codes.NOT_FOUND).json({
          message: 'LESSON_NOT_FOUND',
          data: null,
        });
      }
      next(error);
    }
  },
};
