const router = require('express').Router();
const controller = require('./controller');
const { checkTokenMiddleware } = require('../../../utils/authService');

router.get('/by-owner', checkTokenMiddleware, controller.getAll);
router.get('/by-school-unit', checkTokenMiddleware, controller.getBySchool);
router.get('/by-school-system', checkTokenMiddleware, controller.getBySchoolSystem);
router.get('/:_id/versions', checkTokenMiddleware, controller.getVersions);
router.get('/:_id', checkTokenMiddleware, controller.getById);
router.get('/', checkTokenMiddleware, controller.getAll);

module.exports = router;
