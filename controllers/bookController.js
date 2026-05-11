const { validationResult } = require('express-validator');
const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
  try {
    const { genre, available, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (available !== undefined) filter.available = available === 'true';
    const books = await Book.find(filter)
      .populate('addedBy', 'name email')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Book.countDocuments(filter);
    res.status(200).json({ status: 'success', total, page: Number(page), books });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email');
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Livre non trouvé.' });
    }
    res.status(200).json({ status: 'success', book });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.array() });
  }
  try {
    const book = await Book.create({ ...req.body, addedBy: req.user.id });
    res.status(201).json({ status: 'success', book });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Livre non trouvé.' });
    }
    res.status(200).json({ status: 'success', book });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Livre non trouvé.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// BONUS — Statistiques
const getStats = async (req, res) => {
  try {
    const total = await Book.countDocuments();
    const available = await Book.countDocuments({ available: true });
    const byGenre = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } },
    ]);
    res.status(200).json({
      status: 'success',
      stats: {
        total,
        availablePercentage: total ? Math.round((available / total) * 100) : 0,
        byGenre,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook, getStats };