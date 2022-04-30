const router = require('express').Router();
const controller = require('./controller');

const lessonRoutes = require('./Lesson/routes');
const questionRoutes = require('./Question/routes');

const { checkTokenMiddleware } = require('../../utils/authService');


router.use('/lesson', lessonRoutes);
router.use('/question', questionRoutes);
router.get('/:documentId', checkTokenMiddleware, controller.getByType);
router.get('/', checkTokenMiddleware, controller.getAll);


module.exports = router;
