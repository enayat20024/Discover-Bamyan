const User = require("../Models/user");
const passport = require("../config/passport");

// helper fuction
const formatUser = (user) => {
  return {
    id: user._id,
    username: user.username,
    userName: user.userName,
    userPic: user.userPic,
    role: user.role,
    phoneNumber: user.phoneNumber,
    location: user.location,
    provider: user.provider,
  };
};

// Local Register

exports.registerUser = async (req, res) => {
  try {
    const role = req.body.role || "User";
    const userPic =
      req.body.userPic ||
      "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp";
    const newUser = new User({
      username: req.body.username,
      userName: req.body.userName,
      userPic: userPic,
      role: role,
      provider: "local",
    });

    // Register the new user
    User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        // ✅ HANDLE DUPLICATE USER
        if (err.name === "UserExistsError") {
          return res.status(409).json({
            success: false,
            message: "User already exists. Please login instead.",
          });
        }
        console.log(err);

        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }
      // passport.authenticate("local")(req, res, () => res.redirect("/"));
      passport.authenticate("local")(req, res, () => {
        // Automatically log in user after registration
        req.login(user, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }
          return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user: formatUser(user), // changes comes here
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Local Login

// exports.loginUser = passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
// });

exports.loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message,
      });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: formatUser(user),
      });
    });
  })(req, res, next);
};

// google callback

exports.googleCallback = passport.authenticate("google", {
  failureRedirect: "/login",
});

// facebook callback

exports.facebookCallback = passport.authenticate("facebook", {
  failureRedirect: "/login",
});

// session logout

exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
};

// auth check
exports.checkAuth = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({
    user: formatUser(req.user),
  });
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, userName, location, phoneNumber, role } =
      req.body;
    const userPic = req.file
      ? `/uploads/${req.file.filename}`
      : "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp";
    const newUser = new User({
      username,
      userName,
      location,
      phoneNumber,
      role,
      userPic,
      provider: "local",
    });
    User.register(newUser, password, (err, user) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user,
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
