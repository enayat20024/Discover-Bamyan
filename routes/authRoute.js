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
// FACEBOOK AUTH
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
);

// FACEBOOK CALLBACK
router.get(
  "/facebook/callback",
  (req, res, next) => {
    const requestId = Math.random().toString(36).substring(2, 8);

    req.facebookRequestId = requestId;

    console.log("==========================================");
    console.log("FACEBOOK CALLBACK HIT");
    console.log("REQUEST ID:", requestId);
    console.log("TIME:", new Date().toISOString());
    console.log("CODE EXISTS:", !!req.query.code);
    console.log("==========================================");

    next();
  },

  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),

  (req, res) => {
    console.log("==========================================");
    console.log("FACEBOOK LOGIN SUCCESS");
    console.log("REQUEST ID:", req.facebookRequestId);
    console.log("==========================================");

    res.redirect("/");
  },
);

// LOGOUT

router.post("/logout", logoutUser);

module.exports = router;
