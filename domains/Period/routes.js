const express = require('express');

const router = express.Router();
const { checkTokenMiddleware } = require('../../utils/authService');
const periodController = require('./period');

router.post('/', checkTokenMiddleware, periodController.addPeriod);
router.get('/', checkTokenMiddleware, periodController.getPeriods);

module.exports = router;
