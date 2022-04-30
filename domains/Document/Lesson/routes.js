const router = require('express').Router();
const controller = require('./controller');
const { checkTokenMiddleware } = require('../../../utils/authService');

router.post('/fork', checkTokenMiddleware, controller.fork);
router.delete('/pull/:_id', checkTokenMiddleware, controller.deletePull);
router.post('/pull', checkTokenMiddleware, controller.pullRequest);
router.post('/pull-accept/:_id', checkTokenMiddleware, controller.pull);
router.post('/pull-deny/:_id', checkTokenMiddleware, controller.denyPull);
router.delete('/:_id', checkTokenMiddleware, controller.delete);
router.get('/by-owner', checkTokenMiddleware, controller.getAll);
router.get('/by-school-unit/:_id', controller.getBySchool);
router.get('/by-school-system', checkTokenMiddleware, controller.getBySchoolSystem);
router.get('/:_id/versions', checkTokenMiddleware, controller.getVersions);
router.get('/:_id', checkTokenMiddleware, controller.getById);
router.get('/', checkTokenMiddleware, controller.getAll);

module.exports = router;
