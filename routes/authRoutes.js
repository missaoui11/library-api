const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');

const registerValidation = [
  body('name').notEmpty().withMessage('Le nom est obligatoire'),
  body('email').isEmail().withMessage('Format email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe minimum 8 caractères'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Format email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire'),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;