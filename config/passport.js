const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../Models/user");

// Configure Passport local strategy for local authentication
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize user instances to and from the session

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

// Configure Passport strategies for Google and Facebook authentication

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}/api/v1/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        {
          // googleId: profile.id,
          userName: profile.displayName,
          userPic: profile._json.picture,
          provider: "google",
        },
        function (err, user) {
          return cb(err, user);
        },
      );
    },
  ),
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: `${process.env.APP_URL}/api/v1/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      const username = profile.displayName || profile.id;
      const userPic =
        profile.photos && profile.photos.length > 0
          ? profile.photos[0].value
          : null;
      User.findOrCreate(
        {
          // facebookId: profile.id,
          provider: "facebook",
        },
        {
          username: username,
          userPic: userPic,
          userName: profile.displayName, // Store the displayName as userName
        },
        function (err, user) {
          return cb(err, user);
        },
      );
    },
  ),
);

module.exports = passport;
