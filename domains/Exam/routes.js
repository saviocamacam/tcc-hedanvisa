const express = require('express');
const examController = require('./exam');
const { checkTokenMiddleware } = require('../../utils/authService');

const examRouter = express.Router();
examRouter.post('/', checkTokenMiddleware, examController.addExam);

module.exports = examRouter;
