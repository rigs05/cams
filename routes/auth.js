const express = require("express");
const authController = require("../controllers/auth.js");

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/fback', authController.fback);

module.exports = router;