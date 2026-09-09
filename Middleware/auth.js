// middleware/auth.js
module.exports = function (req, res, next) {
  // If the user is authenticated, add the user object to the response locals
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
};
