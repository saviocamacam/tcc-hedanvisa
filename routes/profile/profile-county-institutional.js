const express = require('express');

const router = express.Router();
const { checkTokenMiddleware } = require('../../utils/authService');
const models = require('../../models/index');

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message,
  });
}

router.get('/', checkTokenMiddleware, async (req, res) => {
  try {
    const profiles = await models.ProfileCountyInstitutional.find(
      req.query,
    ).select('state_id _id showType name avatar available active');
    res.status(200).json({
      success: true,
      message: 'Counties by states.',
      data: {
        profiles,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/:_id/county-managers', checkTokenMiddleware, async (req, res) => {
  try {
    const school = await models.ProfileCountyInstitutional.findById(
      req.params._id,
    )
      .select('county_managers')
      .populate({
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
            select: 'shortName people mainPhone mainEmail',
            populate: [
              {
                path: 'people',
                model: 'People',
                select: 'name',
              },
              {
                path: 'mainEmail',
                model: 'Contact',
              },
              {
                path: 'mainPhone',
                model: 'Contact',
              },
            ],
          },
        },
      });

    if (school) {
      res.status(200).json({
        success: true,
        message: 'The School Profile has found.',
        data: {
          profile: school,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'The SChool Profile has not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get(
  '/:_id/schools/school-managers',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const profiles = await models.ProfileCountyInstitutional.findById(
        req.params._id,
      )
        .select('schools')
        .populate({
          path: 'schools',
          model: 'ProfileSchoolInstitutional',
          select: 'institution school_managers',
          populate: [
            {
              path: 'institution',
              model: 'InstitutionSchool',
            },
            {
              path: 'school_managers',
              model: 'Link',
              populate: [
                {
                  path: 'requested',
                  model: 'ProfileSchoolInstitutional',
                  select: 'institution',
                  populate: {
                    path: 'institution',
                    model: 'InstitutionSchool',
                    select: 'name',
                  },
                },
                {
                  path: 'requesting',
                  model: 'ProfileSchool',
                  select: 'avatar user role institution showType',
                  populate: [
                    {
                      path: 'role',
                      model: 'Role',
                      populate: {
                        path: 'school',
                        model: 'ProfileSchoolInstitutional',
                        select: 'institution',
                        populate: {
                          path: 'institution',
                          model: 'InstitutionSchool',
                          select: 'name',
                        },
                      },
                    },
                    {
                      path: 'user',
                      model: 'User',
                      select: 'shortName people mainPhone mainEmail',
                      populate: [
                        {
                          path: 'people',
                          model: 'People',
                          select: 'name',
                        },
                        {
                          path: 'mainPhone',
                          model: 'Contact',
                        },
                        {
                          path: 'mainEmail',
                          model: 'Contact',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
      if (profiles.schools) {
        let schoolManagers = [];
        await profiles.schools.forEach((element) => {
          schoolManagers = schoolManagers.concat(element.school_managers);
        });
        res.status(200).json({
          success: true,
          message: 'School Managers by County.',
          data: schoolManagers,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'PROFILES_NOT_FOUND',
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
);

router.get('/:_id/school-years', checkTokenMiddleware, async (req, res) => {
  try {
    const schoolYears = await models.SchoolYear.find({
      county: req.params._id,
    });
    res.status(200).json({
      success: true,
      message: 'School Years has been found',
      data: schoolYears,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const county = await models.ProfileCountyInstitutional.findById(
      req.params._id,
    ).select('state_id _id showType name avatar available active currentYear');
    res.status(200).json({
      success: true,
      message: 'County by id.',
      data: {
        county,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get(
  '/:_idProfile/document/:_documentType/count',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const documents = await models.Document.aggregate([
        {
          $match: {
            'meta.type': req.params._documentType,
          },
        },
        {
          $count: 'result',
        },
      ]);

      res.status(200).json({
        message: 'DOCUMENT_TYPE_COUNT',
        success: true,
        data: documents.result,
      });
    } catch (error) {
      badRequestError(res, error.message);
    }
  },
);

router.get(
  '/:_idProfile/document/:_documentType',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const query = {
        'meta.type': req.params._documentType,
      };
      if (req.query.discipline) {
        query['meta.theme'] = parseInt(req.query.discipline, 10);
      }
      if (req.query.year) {
        query['meta.year'] = parseInt(req.query.year, 10);
      }
      if (req.query.level) {
        query['meta.level'] = parseInt(req.query.level, 10);
      }


      const options = {
        page: req.query.page,
        limit: req.query.limit,
        lean: true,
        // select: "-content",
        sort: 'updatedAt',
        populate: {
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
                select: 'institution countyInstitutional',
                populate: [
                  {
                    path: 'institution',
                    model: 'Institution',
                    select: 'name',
                  },
                  {
                    path: 'countyInstitutional',
                    model: 'Profile',
                    select: 'name',
                  },
                ],
              },
            },
          ],
        },
      };

      // delete req.query.page;
      // delete req.query.pagesize;


      const documents = await models.Document.paginate(query, options);

      /* let documents = await models.Document.find(query)
        .select("-content")
        .populate({
          path: "owner",
          model: "Profile",
          select: "user school",
          populate: [
            {
              path: "user",
              model: "User",
              select: "shortName people",
              populate: { path: "people", model: "People", select: "name" }
            },
            {
              path: "school",
              model: "Link",
              select: "requested",
              populate: {
                path: "requested",
                model: "Profile",
                select: "institution countyInstitutional",
                populate: [
                  {
                    path: "institution",
                    model: "Institution",
                    select: "name"
                  },
                  {
                    path: "countyInstitutional",
                    model: "Profile",
                    select: "name"
                  }
                ]
              }
            }
          ]
        }); */

      // documents.forEach(doc => {
      //   if (doc.owner.school)
      //     console.log(doc.owner.school.requested.countyInstitutional._id);
      // });

      // return res.status(200).send(documents);


      let documentsReturn = documents.docs.filter(
        (doc) => doc.owner.school
          && doc.owner.school.requested.countyInstitutional._id
          === req.params._idProfile,
      );
      // console.log(documentsReturn);
      if (req.query.school) {
        documentsReturn = documents.docs.filter(
          (doc) => doc.owner.school
            && doc.owner.school.requested._id === req.query.school,
        );
      }

      if (documents.docs.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Documents has found',
          data: {
            docs: documentsReturn,
            ...documents,
          },
        });
      } else {
        res.status(200).json({
          success: false,
          message: 'Documents not found',
        });
      }
    } catch (error) {
      badRequestError(res, error.message);
    }
  },
);

router.get(
  '/:_idProfile/document/:_documentType/:_id',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const query = {
        _id: req.params._id,
        'meta.type': req.params._documentType,
      };
      if (req.query.discipline) {
        query['meta.theme'] = parseInt(req.query.discipline, 10);
      }
      if (req.query.year) {
        query['meta.year'] = parseInt(req.query.year, 10);
      }

      const documents = await models.Document.find(query).populate({
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
              select: 'institution countyInstitutional',
              populate: [
                {
                  path: 'institution',
                  model: 'Institution',
                  select: 'name',
                },
                {
                  path: 'countyInstitutional',
                  model: 'Profile',
                  select: 'name',
                },
              ],
            },
          },
        ],
      });

      // documents.forEach(doc => {
      //   if (doc.owner.school)
      //     console.log(doc.owner.school.requested.countyInstitutional._id);
      // });
      console.log(`par: ${req.params._idProfile}`);
      let documentsReturn = documents.filter(
        (doc) => doc.owner.school
          && doc.owner.school.requested.countyInstitutional._id
          === req.params._idProfile,
      );
      // console.log(documentsReturn);
      if (req.query.school) {
        documentsReturn = documents.filter(
          (doc) => doc.owner.school
            && doc.owner.school.requested._id === req.query.school,
        );
      }

      if (documents.length > 0) {
        res.status(200).json({
          success: true,
          message: 'Documents has found',
          data: documentsReturn,
        });
      } else {
        res.status(200).json({
          success: false,
          message: 'Documents not found',
        });
      }
    } catch (error) {
      badRequestError(res, error.message);
    }
  },
);

router.post('/', checkTokenMiddleware, async (req, res) => {
  try {
    const newCountyProfile = await models.ProfileCountyInstitutional.create({
      name: req.body.name,
      state_id: req.body.state_id,
      external_id: req.body.id,
    });
    if (newCountyProfile) {
      res.status(201).json({
        success: true,
        message: `The county's institutional profile page was created for ${
          req.body.name
        }`,
        data: {
          id: newCountyProfile._id,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: `The county's institutional profile page hasn't created for ${
          req.body.name
        }`,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

module.exports = router;
