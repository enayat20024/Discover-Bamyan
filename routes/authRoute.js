const router = require("express").Router();
const passport = require("passport");
const usedFacebookCodes = new Set();

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

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] }),
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
