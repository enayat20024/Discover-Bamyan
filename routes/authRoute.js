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
// FACEBOOK LOGIN
router.get("/facebook", (req, res, next) => {
  console.log("FACEBOOK LOGIN START:", Date.now());

  passport.authenticate("facebook", {
    scope: ["email"],
  })(req, res, next);
});

// FACEBOOK CALLBACK
router.get("/facebook/callback", (req, res, next) => {
  console.log("====================================");
  console.log("FACEBOOK CALLBACK HIT");
  console.log("TIME:", new Date().toISOString());
  console.log("HAS CODE:", !!req.query.code);
  console.log("====================================");

  passport.authenticate("facebook", {
    failureRedirect: "/login",
  })(req, res, (err) => {
    if (err) {
      console.error("FACEBOOK AUTH ERROR:", err);
      return next(err);
    }

    console.log("FACEBOOK AUTH SUCCESS:", req.user?._id);

    req.logIn(req.user, (loginErr) => {
      if (loginErr) {
        console.error("SESSION LOGIN ERROR:", loginErr);
        return next(loginErr);
      }

      console.log("FACEBOOK SESSION CREATED");
      res.redirect("/");
    });
  });
});

// LOGOUT

router.post("/logout", logoutUser);

module.exports = router;
