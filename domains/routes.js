const express = require('express');

const router = express.Router();

router.use('/exam', require('./Exam').routes);
router.use('/discipline', require('./Discipline').routes);
router.use('/matrix', require('./EvaluativeMatrix').routes);
router.use('/period', require('./Period').routes);
router.use('/valuation', require('./Valuation').routes);
router.use('/event', require('./Event').routes);
router.use('/documents', require('./Document').routes);

module.exports = router;
