const { celebrate, Joi } = require('celebrate');
const { JoiPagination } = require('../../utils/JoiModels');

const references = Joi.object().keys({
  title: Joi.string().required(),
  link: Joi.string().required(),
  license: Joi.string().required(),
});

const attachments = Joi.object().keys({
  description: Joi.string().required(),
  attachType: Joi.string().required(),
  link: Joi.string().required(),
  license: Joi.string(),
});

module.exports = {
  add() {
    return celebrate({
      body: Joi.object()
        .keys({
          series: Joi.string().required(),
          course: Joi.string().required(),
          discipline: Joi.string().required(),
          goal: Joi.string().required(),
          title: Joi.string().required(),
          content: Joi.string().required(),
          references: Joi.array().items(references),
          attachments: Joi.array().items(attachments),
          habilities: Joi.array().allow([null]),
          license: Joi.string().required(),
          publicCounty: Joi.boolean(),
          publicSchool: Joi.boolean(),
          county: Joi.string(),
          school: Joi.string().allow('', null),
        })
        .required(),
    });
  },
  get() {
    return celebrate({
      query: Joi.object().keys({
        discipline: Joi.string(),
        pagination: JoiPagination(1, 100),
      }),
    });
  },
  getBySchool() {
    return celebrate({
      query: Joi.object().keys({
        pagination: JoiPagination(1, 100),
      }),
    });
  },
  getByCounty() {
    return celebrate({
      query: Joi.object().keys({
        pagination: JoiPagination(1, 100),
      }),
    });
  },
  trending() {
    return celebrate({
      query: Joi.object().keys({
        pagination: JoiPagination(1, 100),
      }),
    });
  },
  update() {
    return celebrate({
      body: Joi.object()
        .keys({
          discipline: Joi.string().required(),
          goal: Joi.string().required(),
          title: Joi.string().required(),
          content: Joi.string().required(),
          references: Joi.array().items(references),
          attachments: Joi.array().items(attachments),
          habilities: Joi.array().allow([null]),
          license: Joi.string().required(),
          publicCounty: Joi.boolean(),
          publicAtla: Joi.boolean(),
          publicSchool: Joi.boolean(),
          county: Joi.string(),
          school: Joi.string().allow('', null),
        })
        .required(),
    });
  },
};
