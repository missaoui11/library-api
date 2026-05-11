const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est obligatoire'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "L'auteur est obligatoire"],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, "L'ISBN est obligatoire"],
    unique: true,
  },
  genre: {
    type: String,
    enum: ['roman', 'sci-fi', 'histoire', 'technique', 'autre'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  publishedAt: {
    type: Number,
  },
});

BookSchema.index({ isbn: 1 });

module.exports = mongoose.model('Book', BookSchema);