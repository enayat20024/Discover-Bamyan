const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  userName: { type: String },
  userPic: {
    type: String,
    default:
      "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp",
  },
  provider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  role: {
    type: String,
    enum: ["User", "Guide", "Admin"],
    default: "User",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  googleId: String,
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

// userSchema.pre("save", async (next) => {
//   if (!this.isModified("password")) return next();
//   if (!this.password) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.comparePassword = function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("user", userSchema);

module.exports = User;
