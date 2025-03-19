//роутинг аторизации
const AuthController = require('../controllers/auth.controller');
const express = require('express');

const router = express.Router();

router.post("/signup", AuthController.signUp); //роут регистрации
router.post("/login", AuthController.login); //роут входа в систему
router.post("/refresh", AuthController.refresh); //роут для обновления access-токена
router.post("/logout", AuthController.logout); //роут выхода из системы

module.exports = router;