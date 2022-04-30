const Joi = require('@hapi/joi');
const models = require('../../models');

/*
  /matrix
    - POST / (addMatrix)
      - Body:
        - classroom
        - owner
        - period
        - discipline
        - valuations
          - description
          - weight

    - GET / (getMatrix)
      - Body:
        - classroom
        - period
        - discipline

*/


async function addMatrix(req, res) {
  try {
    const { error } = Joi.object()
      .keys({
        body: {
          owner: Joi.string().required(),
          classroom: Joi.string().required(),
          period: Joi.string().required(),
          discipline: Joi.string().required(),
          valuations: Joi.array()
            .min(1)
            .items(
              Joi.object().keys({
                description: Joi.string().required(),
                weight: Joi.number().required(),
              }),
            )
            .required(),
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


    // todo: Checar se o professor tem permissão para criar matrizes na turma
    // todo: Adicionar session nas consultas
    // todo: Atribuir owner

    let matrix = await models.EvaluativeMatrix.findOne({
      classroom: req.body.classroom,
      period: req.body.period,
      discipline: req.body.discipline,
    });

    if (matrix) {
      return res.json({
        success: false,
        message: 'MATRIX_ALREADY_EXISTS',
        data: null,
      });
    }

    console.log(req.body.valuations);
    const sumWeights = req.body.valuations
      .map((valuation) => Number(valuation.weight))
      .reduce((prev, el) => prev + el);
    console.log(sumWeights);
    if (sumWeights !== 10.0) {
      return res.json({
        success: false,
        message: 'INVALID_WEIGHTS',
        data: null,
      });
    }

    const classroom = await models.Classroom.findById(req.body.classroom);
    if (!classroom) {
      return res.json({
        success: false,
        message: 'CLASSROOM_NOT_EXISTS',
        data: null,
      });
    }

    const owner = await models.Profile.findById(req.body.owner);
    if (!owner) {
      return res.json({
        success: false,
        message: 'PROFESSOR_NOT_EXISTS',
        data: null,
      });
    }

    const discipline = await models.Discipline.findById(req.body.discipline);
    if (!discipline) {
      return res.json({
        success: false,
        message: 'DISCIPLINE_NOT_EXISTS',
        data: null,
      });
    }

    const period = await models.Period.findById(req.body.period);
    if (!period) {
      return res.json({
        success: false,
        message: 'PERIOD_NOT_EXISTS',
        data: null,
      });
    }

    matrix = await new models.EvaluativeMatrix({
      owner,
      classroom,
      discipline,
      period,
      valuations: [],
    }).save();

    let valuations = req.body.valuations.map(({ description, weight }) => ({
      description,
      weight,
      evaluativeMatrix: matrix,
    }));

    valuations = await models.Valuation.create(valuations);

    matrix = await models.EvaluativeMatrix.findByIdAndUpdate(
      matrix,
      { $set: { valuations } },
      { new: true },
    );

    classroom.evaluativeMatrixes.push(matrix);

    await Promise.all([classroom.save()]);

    return res.json({
      success: true,
      message: 'MATRIX_CREATED',
      data: matrix,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}

async function deleteById(req, res) {
  try {
    const { id } = req.params;

    const evaluativeMatrix = await models.EvaluativeMatrix.findById(id);

    if (!evaluativeMatrix) {
      res.status(404).json({
        message: 'EVALUATIVE_MATRIX_NOT_FOUND',
        data: null,
      });
    } else if (evaluativeMatrix.status === 'accepted') {
      res.status(200).json({
        message: 'EVALUATIVE_MATRIX_ALREADY_ACCEPTED',
        data: null,
      });
    } else {
      const { valuations, recoveries, classroom } = evaluativeMatrix;

      await Promise.all(
        valuations.map(async (valuation) => {
          await models.EnrollmentValuation.deleteMany(
            { valuation },
          );
        }),
      );

      await Promise.all(
        valuations.map(async (element) => {
          await models.Valuation.findByIdAndDelete(element._id);
        }),
      );

      await Promise.all(
        recoveries.map(async (element) => {
          await models.Valuation.findByIdAndDelete(element._id);
        }),
      );

      const classroomObj = await models.Classroom.findById(classroom);

      classroomObj.evaluativeMatrixes = classroomObj.evaluativeMatrixes.filter(
        (element) => element !== id,
      );

      classroomObj.save();

      await models.EvaluativeMatrix.findByIdAndDelete(id);

      res.status(200).json({
        message: 'EVALUATIVE_MATRIX_DELETED',
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: 'ERROR', data: error });
  }
}

async function getMatrixByClassroom(req, res) {
  try {
    const { error } = Joi.object()
      .keys({
        query: {
          classroom: Joi.string().required(),
          period: Joi.string(),
          discipline: Joi.string(),
          owner: Joi.string(),
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

    // todo: Checar permissão
    // todo: Adicionar session nas consultas

    const matrix = await models.EvaluativeMatrix.find(
      req.query,
    ).populate([
      { path: 'discipline' },
      { path: 'owner', select: 'user', populate: { path: 'user', select: 'people', populate: { path: 'people' } } },
      {
        path: 'valuations',
        model: 'Valuation',
        populate: [{
          path: 'exam',
          model: 'Exam',
          populate: { path: 'date', model: 'Event' },
        }],
      },
      {
        path: 'recoveries',
        model: 'Valuation',
        populate: [{
          path: 'exam',
          model: 'Exam',
          populate: { path: 'date', model: 'Event' },
        }],
      },
    ]);

    if (!matrix) {
      return res.json({
        success: false,
        message: 'MATRIX_NOT_EXISTS',
        data: null,
      });
    }

    return res.json({
      success: true,
      message: 'MATRIX_EXISTS',
      data: matrix,
    });
  } catch (error) {
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}

async function getMatrix(req, res) {
  try {
    const { error } = Joi.object()
      .keys({
        query: {
          classroom: Joi.string().required(),
          period: Joi.string().required(),
          discipline: Joi.string().required(),
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

    // todo: Checar permissão
    // todo: Adicionar session nas consultas

    const matrix = await models.EvaluativeMatrix.findOne({
      classroom: req.query.classroom,
      period: req.query.period,
      discipline: req.query.discipline,
    }).populate([
      { path: 'discipline' },
      {
        path: 'valuations',
        model: 'Valuation',
        populate: [{
          path: 'exam',
          model: 'Exam',
          populate: { path: 'date', model: 'Event' },
        }],
      },
      {
        path: 'recoveries',
        model: 'Valuation',
        populate: [{
          path: 'exam',
          model: 'Exam',
          populate: { path: 'date', model: 'Event' },
        }],
      }]);

    if (!matrix) {
      return res.json({
        success: false,
        message: 'MATRIX_NOT_EXISTS',
        data: null,
      });
    }

    return res.json({
      success: true,
      message: 'MATRIX_EXISTS',
      data: matrix,
    });
  } catch (error) {
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}


async function addRecovery(req, res) {
  try {
    const { recoveries, evaluativeMatrix } = req.body;

    const sumWeights = recoveries
      .map((valuation) => Number(valuation.weight))
      .reduce((prev, el) => prev + el);
    console.log(sumWeights);
    const eMatrix = await models.EvaluativeMatrix.findById(
      evaluativeMatrix,
    );

    if (!eMatrix) {
      res.status(404).json({
        message: 'EVALUATIVE_MATRIX_NOT_FOUND',
        data: null,
      });
    } else if (eMatrix.status === 'accepted' || eMatrix.status === 'denied') {
      res.status(400).json({
        message: 'EVALUATIVE_MATRIX_MUST_WAITING',
        data: null,
      });
    } else if (sumWeights !== 10.0) {
      res.status(400).json({
        message: 'INVALID_WEIGHTS',
        data: null,
      });
    } else {
      const setEvaluativeMatrixValuations = new Set(eMatrix.valuations);

      const allRecoveryValuations = [].concat(
        ...recoveries.map(({ valuations }) => valuations),
      );
      const setRecoveryValuations = new Set(allRecoveryValuations);

      // Verificação se possui elementos repetidos em recoveryValuations
      if (allRecoveryValuations.length !== setRecoveryValuations.size) {
        throw new Error('REPEATED_VALUATIONS_BETWEEN_RECOVERIES');
      }

      // Verficação se elementos de recoveryValuations são os mesmos de evaluativeMatrixValuations
      const difference = new Set(
        [...setEvaluativeMatrixValuations].filter(
          (elem) => !setRecoveryValuations.has(elem.toString()),
        ),
      );
      if (difference.size !== 0) {
        throw new Error('INVALID_RECOVERY_VALUATIONS');
      }

      // eslint-disable-next-line max-len
      // Verificação se a soma dos valuations de cada recovery são os mesmos de seus respectivos valuations
      await Promise.all(
        recoveries.map(async (element) => {
          const { valuations } = element;
          const weights = await Promise.all(
            valuations.map(async (valuation) => {
              const val = await models.Valuation.findById(
                valuation,
                'weight',
              );
              return val.weight;
            }),
          );

          const sumWeightsValuations = weights
            .map((valuation) => valuation)
            .reduce((prev, el) => prev + el);

          if (sumWeightsValuations !== element.weight) {
            throw new Error('VALUATIONS_RECOVERY_WEIGHT_CONFLICT');
          }
          await Promise.all(
            valuations.map(async (valuation) => {
              await models.Valuation.findOneAndUpdate(
                valuation,
                { $set: { recovered: true } },
              );
            }),
          );
        }),
      );

      let recoveryValuations = recoveries.map(
        ({ description, weight, valuations }) => ({
          description,
          weight,
          evaluativeMatrix,
          valuations,
        }),
      );

      recoveryValuations = await models.Valuation.create(recoveryValuations);

      eMatrix.recoveries = recoveryValuations;
      await eMatrix.save();

      res.status(200).json({
        message: 'SUCCESS',
        data: recoveryValuations,
      });
    }
  } catch (error) {
    switch (error.message) {
      case 'REPEATED_VALUATIONS_BETWEEN_RECOVERIES':
        res.status(400).json({
          message: 'REPEATED_VALUATIONS_BETWEEN_RECOVERIES',
          data: null,
        });

        break;

      case 'INVALID_RECOVERY_VALUATIONS':
        res.status(400).json({
          message: 'INVALID_RECOVERY_VALUATIONS',
          data: null,
        });

        break;

      case 'VALUATIONS_RECOVERY_WEIGHT_CONFLICT':
        res.status(400).json({
          message: 'VALUATIONS_RECOVERY_WEIGHT_CONFLICT',
          data: null,
        });

        break;

      default:
    }
  }
}

async function changeStatus(req, res) {
  try {
    const { status, evaluativeMatrixId } = req.body;


    const rules = {
      accepted: ['done', 'closed'],
      waiting: ['accepted', 'denied'],
      denied: ['waiting'],
      closed: ['accepted'],
    };

    const evaluativeMatrix = await models.EvaluativeMatrix.findById(
      evaluativeMatrixId,
      null,
    );

    if (!evaluativeMatrix) throw new Error('EVALUATIVE_MATRIX_NOT_FOUND');

    const evaluativeMatrixStatus = evaluativeMatrix.status;

    if (!rules[evaluativeMatrixStatus].includes(status)) {
      throw new Error('STATUS_NOT_ALLOWED');
    }

    evaluativeMatrix.status = status;
    await evaluativeMatrix.save();

    return res.status(200).json({
      message: 'SUCCESS',
      data: null,
    });
  } catch (error) {
    switch (error.message) {
      case 'EVALUATIVE_MATRIX_NOT_FOUND':
        res.status(404).json({
          message: 'EVALUATIVE_MATRIX_NOT_FOUND',
          data: null,
        });
        break;

      case 'STATUS_NOT_ALLOWED':
        res.status(400).json({
          message: 'STATUS_NOT_ALLOWED',
          data: null,
        });
        break;

      default:
    }
    return res.json({ success: false, message: 'ERROR', data: error });
  }
}

module.exports = {
  addMatrix, getMatrix, getMatrixByClassroom, deleteById, addRecovery, changeStatus,
};
