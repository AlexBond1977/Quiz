// роутинг работы с тестами
const TestController = require('../controllers/test.controller');
const MiddlewareUtils = require('../utils/middleware.utils');
const express = require('express');
const router = express.Router();

router.get('/', MiddlewareUtils.validateUser, TestController.getTests); //получение тестов
router.get('/results', MiddlewareUtils.validateUser, TestController.getTestResults); //получение результатов тестов
router.get('/:id', MiddlewareUtils.validateUser, TestController.getTest); //получение конкретного теста
router.post('/:id/pass', MiddlewareUtils.validateUser, TestController.passTest); //отправка результатов теста
router.get('/:id/result', MiddlewareUtils.validateUser, TestController.getTestResult); //получение результатов теста
router.get('/:id/result/details', MiddlewareUtils.validateUser, TestController.getTestWithResults); //получение деталей результатов теста

module.exports = router;