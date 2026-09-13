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
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] }),
);
// router.get("/auth/facebook/index", facebookCallback, (req, res) => {
//   res.redirect("/");
// });

router.get(
  "/auth/facebook/index",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  },
);

// LOGOUT

router.post("/logout", logoutUser);

module.exports = router;
