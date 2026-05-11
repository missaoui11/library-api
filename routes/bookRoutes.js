const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById, createBook, updateBook, deleteBook, getStats } = require('../controllers/bookController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const bookValidation = [
  body('title').notEmpty().withMessage('Le titre est obligatoire'),
  body('author').notEmpty().withMessage("L'auteur est obligatoire"),
  body('isbn').notEmpty().withMessage("L'ISBN est obligatoire"),
  body('publishedAt').isInt({ min: 1000, max: 9999 }).withMessage('Année invalide (4 chiffres)'),
];

router.get('/stats', protect, restrictTo('admin'), getStats);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', protect, bookValidation, createBook);
router.put('/:id', protect, restrictTo('admin'), updateBook);
router.delete('/:id', protect, restrictTo('admin'), deleteBook);

module.exports = router;