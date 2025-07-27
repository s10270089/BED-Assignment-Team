module.exports = (req, res, next) => {
  // Assume JWT or session-based auth has already populated req.user
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};