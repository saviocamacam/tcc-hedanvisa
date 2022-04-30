const Joi = require('@hapi/joi');
const models = require('../../models');

async function getPeriods(req, res) {
  try {
    const { error } = Joi.object()
      .keys({
        query: {
          schoolyear: Joi.string().required(),
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

    const schoolYear = await models.SchoolYear.findById(req.query.schoolyear).populate({
      path: 'periods', model: 'Period', select: '_id start end', populate: [{ path: 'start', model: 'Event' }, { path: 'end', model: 'Event' }],
    });

    return res.status(200).json({
      success: true,
      message: 'PERIODS_FOUND',
      data: schoolYear.periods,
    });
  } catch (error) {
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}
async function addPeriod(req, res) {
  try {
    const eventStart = JSON.parse(JSON.stringify(req.body));
    eventStart.allDay = true;
    delete eventStart.createdBy;
    delete eventStart.end;
    eventStart.title = 'Início de Período';

    const startEvent = await models.Event.create(eventStart);

    const eventEnd = JSON.parse(JSON.stringify(req.body));
    eventEnd.allDay = true;
    delete eventEnd.createdBy;
    eventEnd.start = eventEnd.end;
    delete eventEnd.end;
    eventEnd.title = 'Fim de Período';

    const endEvent = await models.Event.create(eventEnd);

    await models.ProfileCountyInstitutional.findByIdAndUpdate(req.body.owner, {
      $push: { events: { $each: [startEvent._id, endEvent._id] } },
    });

    req.body.start = startEvent._id;
    req.body.end = endEvent._id;

    const period = await models.Period.create(req.body);

    await models.SchoolYear.findByIdAndUpdate(req.body.schoolYear, {
      $push: { periods: period._id },
    });

    res.status(201).json({
      success: true,
      message: 'New Period has been created',
      data: period,
    });
  } catch (error) {
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}

module.exports = { getPeriods, addPeriod };
