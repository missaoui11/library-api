const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'Non autorisé. Token manquant.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Utilisateur introuvable.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Token invalide ou expiré.' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Accès refusé. Rôle requis : ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };