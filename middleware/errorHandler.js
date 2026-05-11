const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    status: 'error',
    message: err.message || 'Erreur serveur interne',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  if (err.name === 'ValidationError') {
    response.message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json(response);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    response.message = `La valeur du champ "${field}" existe déjà.`;
    return res.status(400).json(response);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;