export const isAuthenticated = (req, res, next) => {
    if (req.session?.user && req.session.user.role === "user") {
        next();
    } else {
        return res.status(401).json({ message: "User access only" });
    }
};