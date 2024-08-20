const express = require('express');
const handler = require('../controllers/authController');
const { verifySession } = require("supertokens-node/recipe/session/framework/express");

const router = express.Router();

// Register route
router.post('/register', handler.registerValidation(), handler.register);

// Login route
router.post('/login', handler.loginValidation(), handler.login);

// Profile route
router.get('/profile', verifySession(), handler.getProfile);

module.exports = router;
