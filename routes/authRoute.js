const router = require("express").Router();
const passport = require("passport");

const {
  registerUser,
  loginUser,
  googleCallback,
  facebookCallback,
  logoutUser,
  checkAuth,
} = require("../controllers/authController");

// local routes

router.post("/signin", registerUser);
router.post("/login", loginUser);

// Auth Check
router.get("/me", checkAuth);
// Login
router.get("/login", (req, res) => res.render("login"));

// Register
router.get("/signin", (req, res) => res.render("signin"));

// GOOGLE AUTH
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  },
);
// FACEBOOK AUTH
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
);

router.get("/facebook/callback", (req, res, next) => {
  console.log("FACEBOOK CALLBACK:", new Date().toISOString());
  console.log("CODE RECEIVED:", !!req.query.code);

  passport.authenticate("facebook", (err, user, info) => {
    if (err) {
      console.error("FACEBOOK AUTH ERROR:", err);
      return res.redirect("/login");
    }

    if (!user) {
      console.error("FACEBOOK NO USER:", info);
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("SESSION LOGIN ERROR:", err);
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
});

// LOGOUT

router.post("/logout", logoutUser);

module.exports = router;
