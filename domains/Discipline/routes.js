const express = require('express');
const disciplineController = require('./discipline');
const { checkTokenMiddleware } = require('../../utils/authService');

const disciplineRouter = express.Router();
disciplineRouter.get('/', checkTokenMiddleware, disciplineController.getDisciplines);
module.exports = disciplineRouter;
