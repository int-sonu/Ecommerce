export const isAuthenticated = (req, res, next) => {
  if (req.session?.user?.role==="user") {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized Person' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session?.Admin?.role ==="admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};
