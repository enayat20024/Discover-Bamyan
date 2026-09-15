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
router.get("/facebook", (req, res, next) => {
  console.log("FACEBOOK LOGIN START:", Date.now());

  passport.authenticate("facebook", {
    scope: ["email"],
  })(req, res, next);
});

router.get("/facebook/callback", (req, res, next) => {
  const code = req.query.code;

  console.log("====================================");
  console.log("FACEBOOK CALLBACK HIT");
  console.log("TIME:", new Date().toISOString());
  console.log("HAS CODE:", !!code);
  console.log("====================================");

  if (!code) {
    return res.status(400).send("Facebook authorization code is missing.");
  }

  if (usedFacebookCodes.has(code)) {
    console.log("DUPLICATE FACEBOOK CODE - IGNORING");
    return res.redirect("/");
  }

  usedFacebookCodes.add(code);

  setTimeout(() => {
    usedFacebookCodes.delete(code);
  }, 60 * 1000);

  passport.authenticate("facebook", (err, user, info) => {
    if (err) {
      console.error("FACEBOOK AUTH ERROR:", err);
      return next(err);
    }

    if (!user) {
      console.error("FACEBOOK AUTH FAILED:", info);
      return res.redirect("/login");
    }

    console.log("FACEBOOK AUTH SUCCESS:", user._id);

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error("SESSION LOGIN ERROR:", loginErr);
        return next(loginErr);
      }

      console.log("FACEBOOK SESSION CREATED");

      // IMPORTANT:
      // Save the session before redirecting.
      req.session.save((sessionErr) => {
        if (sessionErr) {
          console.error("SESSION SAVE ERROR:", sessionErr);
          return next(sessionErr);
        }

        console.log("FACEBOOK SESSION SAVED");

        return res.redirect("/");
      });
    });
  })(req, res, next);
});

// LOGOUT

router.post("/logout", logoutUser);

module.exports = router;
