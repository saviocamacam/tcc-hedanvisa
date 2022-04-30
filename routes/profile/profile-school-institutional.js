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
    const schools = await models.ProfileSchoolInstitutional.find(req.query)
      .select('-documents -profileType -countyInstitutional')
      .populate({
        path: 'institution',
        model: 'InstitutionSchool',
        select: 'name',
      })
      .populate({ path: 'schoolYearClassrooms', model: 'SchoolYearClassroom' });
    if (schools) {
      res.status(200).json({
        success: true,
        message: 'Schools by county.',
        data: {
          schools,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'No school found.',
      });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/:_id/professors', checkTokenMiddleware, async (req, res) => {
  try {
    const school = await models.ProfileSchoolInstitutional.findById(req.params)
      .select('professors')
      .populate({
        path: 'professors',
        // select: "-requested",
        model: 'Link',
        populate: {
          path: 'requesting',
          model: 'ProfileProfessor',
          select: 'avatar user level serie subjects classrooms showType',
          populate: [
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
                  path: 'mainEmail',
                  model: 'Contact',
                },
                {
                  path: 'mainPhone',
                  model: 'Contact',
                },
              ],
            },
            {
              path: 'classrooms',
              model: 'Classroom',
              select: 'series subClass shift',
            },
          ],
        },
      });
    const professors = school.professors.filter((element) => element.requesting != null);
    res.status(200).json({
      success: true,
      message: 'Requesting Professors',
      data: professors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const school = await models.ProfileSchoolInstitutional.findById(req.params)
      .select('-documents -createdAt')
      .populate([
        {
          path: 'institution',
          model: 'InstitutionSchool',
        },
        {
          path: 'countyInstitutional',
          model: 'ProfileCountyInstitutional',
          select: 'name state_id',
        },
        {
          path: 'school_managers',
          model: 'Link',
          select: 'requesting',
          populate: {
            path: 'requesting',
            model: 'ProfileSchool',
            select: 'user',
            populate: {
              path: 'user',
              model: 'User',
              populate: {
                path: 'people',
                model: 'People',
              },
            },
          },
        },
      ]);

    if (school) {
      res.status(200).json({
        success: true,
        message: 'School found',
        data: {
          school,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'School not found',
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

router.post('/', checkTokenMiddleware, async (req, res) => {
  try {
    const county = await models.ProfileCountyInstitutional.findById(
      req.body.county_id,
    );

    if (county) {
      const institutionSchool = await new models.InstitutionSchool({
        external_id: req.body.id,
        name: req.body.name,
      });

      const profileSchool = await new models.ProfileSchoolInstitutional({
        countyInstitutional: county,
        institution: institutionSchool,
        inep_properties: req.body.inep_properties,
      });
      institutionSchool.profile = profileSchool;
      await institutionSchool.save();
      await profileSchool.save();
      county.schools.push(profileSchool);
      await county.save();
      res.status(201).json({
        success: true,
        message:
          'Institutional info and Institutional Profile Page has been created',
        data: {
          id_institution: institutionSchool._id,
          id_profile: profileSchool._id,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'County not found',
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

router.put('/:_id', checkTokenMiddleware, async (req, res) => {
  try {
    const schoolUpdated = await models.ProfileSchoolInstitutional.findByIdAndUpdate(
      req.params._id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: 'Profile School Institutional has been updated',
      data: {
        school: schoolUpdated,
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

router.get(
  '/current-school-year/:schoolId',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      const school = await models.ProfileSchoolInstitutional.findById(
        req.params.schoolId,
      ).populate({
        path: 'currentSchoolYear',
        model: 'SchoolYear',
      });

      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found.',
        });
      }

      res.status(200).json({
        success: true,
        message: 'School found.',
        data: {
          currentSchoolYear: school.currentSchoolYear,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
);

router.get(
  '/:_idProfile/document/:_documentType',
  checkTokenMiddleware,
  async (req, res) => {
    try {
      console.log(req.query);
      const query = {
        'meta.type': req.params._documentType,
      };
      if (req.query.discipline) {
        query['meta.theme'] = parseInt(req.query.discipline, 10);
      }
      if (req.query.year) {
        query['meta.year'] = parseInt(req.query.year, 10);
      }
      console.log(query);
      const documents = await models.Document.find(query)
        .select('-content')
        .populate({
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

      // documents.forEach(el => {
      //   console.log("doc: " + el.owner.school.requested._id);
      // });
      // console.log("params: " + req.params._idProfile);
      const documentsReturn = documents.filter((el) => (
        el.owner.school
        && el.owner.school.requested._id === req.params._idProfile
      ));
      console.log(documentsReturn.length);
      // console.log(documents);

      if (documentsReturn.length > 0) {
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

module.exports = router;
