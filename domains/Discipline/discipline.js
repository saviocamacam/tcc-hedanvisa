const Joi = require('@hapi/joi');
const models = require('../../models');

async function getDisciplines(req, res) {
  try {
    const { error } = Joi.object()
      .keys({
        query: {
        },
      })
      .validate({ query: req.query });

    if (error !== null) {
      return res.json({
        success: false,
        message: 'INVALID_REQUEST',
        data: error.details,
      });
    }

    const disciplines = await models.Discipline.find({});

    if (!disciplines.length === 0) {
      return res.json({
        success: false,
        message: 'DISCIPLINES_NOT_EXISTS',
        data: null,
      });
    }

    return res.json({
      success: true,
      message: 'DISCIPLINES_FOUND',
      data: disciplines,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}

async function getDisciplineByCourse(req, res) {
  try {
    const { error } = Joi.object()
      .keys({
        query: {
          course: Joi.string().required(),
        },
      })
      .validate({ query: req.query });

    if (error !== null) {
      return res.json({
        success: false,
        message: 'INVALID_REQUEST',
        data: error.details,
      });
    }

    const course = await models.Course.findById(req.query.course).populate({ path: 'disciplines', model: 'Discipline' });

    if (!course) {
      return res.json({
        success: false,
        message: 'COURSE_NOT_EXISTS',
        data: null,
      });
    }

    return res.json({
      success: true,
      message: 'DISCIPLINES_FOUND',
      data: course.disciplines,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}

module.exports = { getDisciplines, getDisciplineByCourse };
