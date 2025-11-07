export const isAuthenticated = (req, res, next) => {
  if (req.session?.user && req.session.user.role === "user") {
    next();
  } else {
    return res.status(401).json({ message: "User access only" });
  }
};



export const isAdmin = (req, res, next) => {
  if (req.session?.Admin?.role ==="admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};
