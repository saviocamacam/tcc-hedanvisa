const express = require('express');
const eventController = require('./controller');
const { checkTokenMiddleware } = require('../../utils/authService');

const examRouter = express.Router();
examRouter.put('/:id', checkTokenMiddleware, eventController.updateDate);

module.exports = examRouter;
