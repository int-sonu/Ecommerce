export const isAdmin = (req, res, next) => {
  if (req.session?.Admin?.role ==="admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};
