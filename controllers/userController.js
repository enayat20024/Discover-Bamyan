const User = require("../Models/user");
const Tour = require("../Models/tour");
const multer = require("multer");
const path = require("path");

exports.updateProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!req.file) {
      return res.status(400).send("Please upload an image");
    }

    if (user.provider !== "local") {
      return res.status(403).json({
        message: "OAuth image cannot be changed",
      });
    }

    user.userPic = "/uploads/" + req.file.filename;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.provider !== "local") {
      if (name) user.userName = name;

      return res.json({
        succuss: true,
        message: "Only limited fields are editable for OAuth account",
        user,
      });
    }

    const { name, location, phoneNumber } = req.body;

    if (name) user.userName = name;
    if (location) user.location = location;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    console.log("Updating user:", req.body);

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
    console.log("Updated user:", user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.postId);
    if (!user) return res.send("User Not Found");
    res.render("user/user", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
};

// user delete his/her account
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.user._id);

    // destroy session
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed",
        });
      }

      req.session.destroy(() => {
        res.clearCookie("connect.sid");

        return res.status(200).json({
          success: true,
          message: "Account deleted successfully",
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// admin delete the user

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);
    await Tour.findOneAndDelete({ user: userId });

    return res.status(200).json({
      success: true,
      message: "User has been deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// catching all users

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
