// middleware/userMiddleware.js
module.exports = function (req, res, next) {
  // If the user is authenticated, add the user object to the response locals
  if (req.isAuthenticated()) {
    const userImageUrl = req.user
      ? req.user.userPic
      : "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp";
    res.locals.user = {
      ...req.user._doc, // Spread the user document properties
      imageUrl: userImageUrl, // Add the image URL property
    };
  }
  next();
};
