const express = require('express');
const matrixController = require('./matrix');
const { checkTokenMiddleware } = require('../../utils/authService');

const matrixRouter = express.Router();
matrixRouter.post('/', checkTokenMiddleware, matrixController.addMatrix);
matrixRouter.get('/', checkTokenMiddleware, matrixController.getMatrixByClassroom);
matrixRouter.delete('/:id', checkTokenMiddleware, matrixController.deleteById);
matrixRouter.put('/addRecovery', checkTokenMiddleware, matrixController.addRecovery);
matrixRouter.get('/byClassroomPeriodDiscipline', checkTokenMiddleware, matrixController.getMatrix);
matrixRouter.put('/changeStatus', checkTokenMiddleware, matrixController.changeStatus);


module.exports = matrixRouter;
