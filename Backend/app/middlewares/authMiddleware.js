const jwt = require('jsonwebtoken');
// code 2 steps
exports.protect = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: 'Non autorisé' });//verify if the token exist

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id user
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token invalide' });//verifify if the token is valid
  }
};

