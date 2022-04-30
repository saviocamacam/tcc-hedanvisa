const { celebrate, Joi } = require('celebrate');

const studentObjectItems = Joi.object().keys({
  enrollment: Joi.string().required(),
  value: Joi.number().required(),
});

const updateAssignmentObjectItems = Joi.object().keys({
  enrollment: Joi.string().required(),
  value: Joi.number().required(),
});

module.exports = {
  assigmentOne() {
    return celebrate({
      body: Joi.object().keys({
        enrollment: Joi.string().required(),
        value: Joi.number().required(),
        valuation: Joi.string().required(),
      }),
    });
  },

  assigmentMany() {
    return celebrate({
      body: Joi.object().keys({
        students: Joi.array()
          .items(studentObjectItems)
          .required(),
        valuation: Joi.string().required(),
      }),
    });
  },

  updateAssignment() {
    return celebrate({
      body: Joi.object().keys({
        students: Joi.array()
          .items(updateAssignmentObjectItems)
          .required(),
        valuation: Joi.string().required(),
      }),
    });
  },
};
