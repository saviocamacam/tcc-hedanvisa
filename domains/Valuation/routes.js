const router = require('express').Router();
const controller = require('./controller');
const validations = require('./validations');
const { checkTokenMiddleware } = require('../../utils/authService');

router.get(
  '/getByEvaluativeMatrix/:evaluativeMatrixId',
  checkTokenMiddleware,
  controller.getByEvaluativeMatrix,
);
router.get(
  '/getByClassroom/:classroomId',
  checkTokenMiddleware,
  controller.getByClassroom,
);
router.get(
  '/enrollmentValuation/:valuationId',
  checkTokenMiddleware,
  controller.getEnrollmentValuations,
);
router.get(
  '/getByDiscipline/:disciplineId',
  checkTokenMiddleware,
  controller.getByDiscipline,
);

router.post(
  '/assignmentOne',
  validations.assigmentOne(),
  checkTokenMiddleware,
  controller.assignmentOne,
);
router.post(
  '/assignmentMany',
  checkTokenMiddleware,
  controller.assignmentMany,
);
router.put(
  '/updateAssignment',
  checkTokenMiddleware,
  controller.updateAssignment,
);

module.exports = router;
