const router = require('express').Router();
const controller = require('./controller');
const validations = require('./validations');
const { checkTokenMiddleware } = require('../../utils/authService');

router.post('/', validations.add(), checkTokenMiddleware, controller.add);
router.get('/', validations.get(), checkTokenMiddleware, controller.get);
router.get(
  '/by-school/:schoolId',
  validations.getBySchool(),
  checkTokenMiddleware,
  controller.getBySchool,
);

router.get('/:lessonId', checkTokenMiddleware, controller.getById);
router.put(
  '/:lessonId',
  validations.update(),
  checkTokenMiddleware,
  controller.update,
);
router.delete('/:lessonId', checkTokenMiddleware, controller.delete);

module.exports = router;
