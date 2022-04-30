const Joi = require('../../node_modules/@hapi/joi');
const models = require('../../models');

/*
  /exam
    - POST / (addExam)
      - Body:
        - valuation
        - date
*/
async function addExam(req, res) {
  try {
    console.log(req.body);
    const { error } = Joi.object()
      .keys({
        body: {
          valuation: Joi.string().required(),
          owner: Joi.string().required(),
          discipline: Joi.string().required(),
          date: Joi.string(),
        },
      })
      .validate({ body: req.body });

    if (error !== null) {
      return res.json({
        success: false,
        message: 'INVALID_REQUEST',
        data: error.details,
      });
    }


    // todo: Checar permissão
    // todo: Adicionar session nas consultas
    // todo: Atribuir owner
    const {
      owner, date, discipline, valuation,
    } = req.body;

    const valuationObj = await models.Valuation.findById(valuation);

    if (!valuationObj) {
      return res.status(200).json({
        success: false,
        message: 'VALUATION_NOT_EXISTS',
        data: null,
      });
    }

    if (valuationObj.exam) {
      return res.status(200).json({
        success: false,
        message: 'EXAM_ALREADY_EXISTS',
        data: null,
      });
    }

    const ownerObj = await models.Profile.findById(owner);

    if (!ownerObj) {
      res.status(404).json({
        message: 'PROFILE_NOT_FOUND',
        data: null,
      });
    }

    const dateObj = await new models.Event({
      title: 'Avaliação',
      owner,
      start: date,
      allDay: true,
    }).save();

    let exam = await new models.Exam({
      date: dateObj,
      owner: ownerObj,
      valuation,
      discipline,
    }).save();

    exam.valuations.push(valuation);
    exam = await exam.save();

    valuationObj.exam = exam;
    await valuationObj.save();

    return res.status(200).json({
      success: true,
      message: 'EXAM_CREATED',
      data: exam,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: 'ERROR', data: error });
  }
}

async function deleteExam(req, res) {
  try {
    const { valuationId } = req.params;

    const valuation = await models.Valuation.findById(valuationId);
    if (!valuation) throw new Error('VALUATION_NOT_FOUND');

    const evaluativeMatrix = await models.EvaluativeMatrix.findById(
      valuation.evaluativeMatrix,
    );

    if (evaluativeMatrix.status !== 'waiting') throw new Error('EVALUATIVE_MATRIX_IS_NOT_WAITING');

    const exam = await models.Exam.findByIdAndDelete(valuation.exam);
    if (!exam) throw new Error('EXAM_NOT_FOUND');

    valuation.exam = undefined;
    await valuation.save();

    const event = await models.Event.findByIdAndDelete(exam.date);
    if (!event) throw new Error('EVENT_NOT_FOUND');

    res.status(200).json({
      message: 'SUCCESS',
      data: exam,
    });
  } catch (error) {
    switch (error.message) {
      case 'VALUATION_NOT_FOUND':
        res.status(404).json({
          message: 'VALUATION_NOT_FOUND',
          data: null,
        });
        break;
      case 'EXAM_NOT_FOUND':
        res.status(404).json({
          message: 'EXAM_NOT_FOUND',
          data: null,
        });
        break;

      case 'EVENT_NOT_FOUND':
        res.status(404).json({
          message: 'EVENT_NOT_FOUND',
          data: null,
        });
        break;
      default:
    }
    return res.status(400).json({ success: false, message: 'ERROR', data: error });
  }
}

module.exports = { addExam, deleteExam };
