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
  "/facebook/callback",
  (req, res, next) => {
    console.log("========== FACEBOOK CALLBACK HIT ==========");
    console.log("TIME:", new Date().toISOString());
    console.log("CODE EXISTS:", !!req.query.code);
    console.log("URL:", req.originalUrl);
    console.log("============================================");

    next();
  },
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log("========== FACEBOOK LOGIN SUCCESS ==========");
    res.redirect("/");
  },
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
);

// FACEBOOK CALLBACK
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/");
  },
);

// LOGOUT

router.post("/logout", logoutUser);

module.exports = router;
