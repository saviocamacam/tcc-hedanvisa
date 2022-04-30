const { Types } = require('mongoose');
const models = require('../../models');

module.exports = {
  async getByEvaluativeMatrix(req, res, next) {
    try {
      const { evaluativeMatrixId } = req.params;

      const valuations = await models.EvaluativeMatrix.findById(
        evaluativeMatrixId,
        'valuations',
      ).populate('valuations');

      res.status(200).json({
        message: 'VALUATION_ASSIGNED',
        data: valuations,
      });

      next();
    } catch (error) {
      next(error);
    }
  },

  async getByClassroom(req, res, next) {
    try {
      const { classroomId } = req.params;

      const classroom = await models.Classroom.findById(classroomId);

      if (!classroom) {
        res.status(404).json({
          message: 'CLASSROOM_NOT_FOUND',
          data: null,
        });
      } else {
        const valuations = await models.EvaluativeMatrix.findOne(
          { classroom: classroomId },
          'valuations',
        ).populate('valuations');

        res.status(200).json({
          message: 'SUCCESS',
          data: valuations,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  async getByDiscipline(req, res, next) {
    try {
      const { disciplineId } = req.params;

      const discipline = await models.Discipline.findById(disciplineId);

      if (!discipline) {
        res.status(404).json({
          message: 'DISCIPLINE_NOT_FOUND',
          data: null,
        });
      } else {
        const valuations = await models.EvaluativeMatrix.findOne(
          { discipline: disciplineId },
          'valuations',
        ).populate('valuations');

        res.status(200).json({
          message: 'SUCCESS',
          data: valuations,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  async assignmentOne(req, res, next) {
    try {
      const { enrollment, value, valuation } = req.body;

      const studentEnrollment = await models.Enrollment.findById(
        enrollment,
      );
      const examValuation = await models.Valuation.findById(valuation);
      const evaluativeMatrix = await models.EvaluativeMatrix.findById(
        examValuation.evaluativeMatrix,
      );
      if (evaluativeMatrix.status !== 'accepted') {
        res.status(200).json({
          message: 'EVALUATIVE_MATRIX_NOT_ACCEPTED',
          data: null,
        });
      } else if (!studentEnrollment) {
        res.status(404).json({
          message: 'STUDENT_NOT_FOUND',
          data: null,
        });
      } else if (!examValuation) {
        res.status(404).json({
          message: 'VALUATION_NOT_FOUND',
          data: null,
        });
      } else {
        const enrollmentValuation = await new models.EnrollmentValuation({
          valuation,
          value,
          enrollment,
        }).save();

        res.status(200).json({
          message: 'SUCCESS',
          data: enrollmentValuation,
        });
      }
      next();
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({
          message: 'DUPLICATE_ERROR',
          data: null,
        });
      }
      next(error);
    }
  },

  async assignmentMany(req, res) {
    try {
      console.log(req.body);
      const { students, valuation } = req.body;

      const studentsEnrollments = await Promise.all(
        students.map(async (element) => {
          const student = await models.Enrollment.findById(
            element.enrollment,
          );
          return student;
        }),
      );

      const examValuation = await models.Valuation.findById(valuation);

      const evaluativeMatrix = await models.EvaluativeMatrix.findById(
        examValuation.evaluativeMatrix,
      );

      // Verifica se algum indice no vetor de matriculas possui o valor undefined
      const verifyEnrollments = studentsEnrollments.some((element) => !element);

      if (evaluativeMatrix.status !== 'accepted') {
        res.status(200).json({
          message: 'EVALUATIVE_MATRIX_NOT_ACCEPTED',
          data: null,
        });
      } else if (verifyEnrollments) {
        res.status(404).json({
          message: 'STUDENT_NOT_FOUND',
          data: null,
        });
      } else if (!examValuation) {
        res.status(404).json({
          message: 'EXAM_NOT_FOUND',
          data: null,
        });
      } else {
        const assigments = await Promise.all(
          students.map(async (element) => {
            const assigment = await new models.EnrollmentValuation({
              valuation,
              value: element.value,
              enrollment: element.enrollment,
              questions: [],
            }).save();
            return assigment;
          }),
        );
        await models.Valuation.findByIdAndUpdate(valuation, { $set: { assigned: true } });
        return res.status(200).json({
          message: 'SUCCESS',
          data: assigments,
        });
      }
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        return res.status(400).json({
          message: 'DUPLICATE_ERROR',
          data: null,
        });
      }
      return res.json({ success: false, message: 'ERROR', data: error });
    }
  },

  async getEnrollmentValuations(req, res) {
    try {
      const { valuationId } = req.params;

      const valuation = await models.Valuation.findById(valuationId);

      if (!valuation) throw new Error('VALUATION_NOT_FOUND');

      const enrollmentValuation = await models.EnrollmentValuation.find(
        { valuation: valuation._id },
      ).populate({
        path: 'valuation',
        select: 'valuations'
      });

      return res.status(200).json({
        message: 'SUCCESS',
        data: enrollmentValuation,
      });
    } catch (error) {
      if (error.message === 'VALUATION_NOT_FOUND') {
        return res.status(404).json({
          message: 'VALUATION_NOT_FOUND',
          data: null,
        });
      }
      return res.json({ success: false, message: 'ERROR', data: error });
    }
  },

  async updateAssignment(req, res) {
    try {
      const { students, valuation } = req.body;
      console.log(valuation);
      console.log(students);

      const examValuation = await models.Valuation.findById(valuation);

      const enrollmentValuations = await Promise.all(
        students.map(async ({ enrollment, value }) => {
          const std = await models.EnrollmentValuation.findOne(
            { enrollment: Types.ObjectId(enrollment), valuation: Types.ObjectId(valuation) },
          );
          return std || { enrollment: Types.ObjectId(enrollment), valuation: Types.ObjectId(valuation), value: Number(value) };
        }),
      );
      console.log(enrollmentValuations);
      enrollmentValuations.forEach((enrollment) => {
        if (enrollment.questions && enrollment.questions.length !== 0) {
          throw new Error('QUESTIONS_ALREADY_VALUATED');
        }
      });

      if (!examValuation) throw new Error('VALUATION_NOT_FOUND');

      const updatedAssignment = await Promise.all(
        students.map(async ({ enrollment, value }) => {
          const novo = await models.EnrollmentValuation.findOneAndUpdate(
            { valuation, enrollment },
            { value },
            { new: true, upsert: true },
          );
          console.log(novo);
          return novo;
        }),
      );

      res.status(200).json({
        message: 'SUCCESS',
        data: updatedAssignment,
      });
    } catch (error) {
      console.log(error);
      switch (error.message) {
        case 'VALUATION_NOT_FOUND':
          res.status(404).json({
            message: 'NOT_FOUND',
            data: null,
          });
          break;

        case 'QUESTIONS_ALREADY_VALUATED':
          res.status(400).json({
            message: 'QUESTIONS_ALREADY_VALUATED',
            data: null,
          });
          break;

        default:
          res.status(400).json({
            message: 'ERROR',
            data: null,
          });
      }
    }
  },
};
