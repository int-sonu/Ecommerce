export const isAuthenticated = (req, res, next) => {
  console.log("Session:", req.session); // <-- check this
  if (req.session?.user && req.session.user.role === "user") {
    next();
  } else {
    console.log("User not logged in");
    return res.status(401).json({ message: "User access only" });
  }
};



export const isAdmin = (req, res, next) => {
  console.log('req.session')

  if (req.session?.Admin?.role ==="admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied' });
  }
};
