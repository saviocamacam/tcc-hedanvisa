const express = require('express');

const router = express.Router();
const { checkTokenMiddleware } = require('../utils/authService');
const models = require('../models/index');

function badRequestError(res, message) {
  res.status(400).json({
    status: false,
    message,
  });
}

router.get('/', checkTokenMiddleware, async (req, res) => {
  try {
    const schoolYearClassrooms = await models.SchoolYearClassroom.find(
      req.query,
    ).populate({ path: 'schoolYear', model: 'SchoolYear' });
    if (schoolYearClassrooms.length === 0) {
      res.status(404).json({
        success: false,
        message: 'School Year with Classrooms not found',
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'School Year with Classrooms has been found',
        data: schoolYearClassrooms,
      });
    }
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.get('/:schoolId', checkTokenMiddleware, async (req, res) => {
  try {
    const schoolYearClassroom = await models.SchoolYearClassroom.find({
      school: req.params.schoolId,
    })
      .populate({
        path: 'schoolYear',
        model: 'SchoolYear',
        select: '_id year periods',
        populate: [
          {
            path: 'periods',
            model: 'Period',
            select: 'start end',
            populate: [
              {
                path: 'start',
                model: 'Event',
              },
              {
                path: 'end',
                model: 'Event',
              },
            ],
          },
        ],
      })
      .populate({
        path: 'school',
        model: 'ProfileSchoolInstitutional',
        select: '_id currentSchoolYearClassroom',
      })
      .populate({
        path: 'classrooms',
        model: 'Classroom',
        select:
          '_id frequencies hour professors series shift subClass students',
        populate: [
          {
            path: 'frequencies',
            model: 'Frequency',
          },
          {
            path: 'professors',
            model: 'Link',
          },
          {
            path: 'students',
            model: 'Enrollment',
          },
        ],
      });

    if (!schoolYearClassroom) {
      res.status(404).json({
        success: false,
        message: 'schoolYearClassroom not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'schoolYearClassroom has found.',
      data: {
        schoolYearClassroom,
      },
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

router.post('/', checkTokenMiddleware, async (req, res) => {
  try {
    let schoolYearClassroom = await models.SchoolYearClassroom.create(req.body);

    schoolYearClassroom = await models.SchoolYearClassroom.findById(
      schoolYearClassroom._id,
    ).populate({
      path: 'schoolYear',
      model: 'SchoolYear',
      select: 'year',
    });

    const profileSchoolInstitutional = await models.ProfileSchoolInstitutional.findById(
      req.body.school,
    );

    profileSchoolInstitutional.schoolYearClassrooms.push(
      schoolYearClassroom._id,
    );

    const today = new Date();
    if (
      schoolYearClassroom.schoolYear.year.getFullYear() >= today.getFullYear()
    ) {
      profileSchoolInstitutional.currentSchoolYearClassroom = schoolYearClassroom._id;
    }

    await profileSchoolInstitutional.save();

    if (req.body.classrooms) {
      await req.body.classrooms.forEach(async (classroom) => {
        await models.Classroom.findByIdAndUpdate(classroom, {
          year: schoolYearClassroom._id,
        });
      });
    }

    res.status(201).json({
      success: true,
      message: 'School Year has been created',
      data: {
        schoolYearClassroom,
      },
    });
  } catch (error) {
    badRequestError(res, error.message);
  }
});

module.exports = router;
