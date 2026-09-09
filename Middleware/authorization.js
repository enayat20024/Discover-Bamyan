function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Unauthorized. Please login first.",
  });
}

// Middleware function to check if the user has the specified role

function hasRole(role) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === role) {
      return next();
    }
    res.status(403).send("Forbidden");
  };
}

module.exports = {
  hasRole,
  isAuthenticated,
};
