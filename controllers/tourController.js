const Tour = require("../Models/Tour");
const User = require("../Models/user");

exports.createGuide = async (req, res) => {
  try {
    const {
      username,
      password,
      userName,
      phoneNumber,
      location,
      languages,
      experience,
      price,
      specialty,
    } = req.body;

    const userPic = req.file
      ? `/uploads/${req.file.filename}`
      : "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp";
    const newUser = new User({
      username,
      userName,
      phoneNumber,
      location,
      role: "Guide",
      userPic,
      provider: "local",
    });

    User.register(newUser, password, async (err, user) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const guide = await Tour.create({
          user: user._id,
          languages: languages ? languages.split(",").map((l) => l.trim()) : [],
          experience: Number(experience),
          price: Number(price),
          specialty,
        });

        return res.status(201).json({
          success: true,
          message: "Guide created successfully",
          user,
          guide,
        });
      } catch (tourError) {
        return res.status(500).json({
          success: false,
          message: tourError.message,
        });
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// catching all guides

exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Tour.find().populate("user");

    res.status(200).json({
      success: true,
      guides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// catching currentGuide

exports.getCurrentGuide = async (req, res) => {
  try {
    const userId = req.user._id;
    const guide = await Tour.findOne({ user: userId }).populate("user");
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      guide,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCurrentGuide = async (req, res) => {
  try {
    const {
      userName,
      specialty,
      experience,
      languages,
      location,
      phoneNumber,
      price,
    } = req.body;

    const guide = await Tour.findOne({ user: req.user._id });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // Find user account
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields

    user.userName = userName;
    user.location = location;
    user.phoneNumber = phoneNumber;

    // Update image

    if (req.file) {
      user.userPic = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // Update guide fields

    guide.specialty = specialty;
    guide.experience = Number(experience);
    guide.price = Number(price);

    guide.languages = languages.split(",").map((item) => item.trim());

    await guide.save();

    const updatedGuide = await Tour.findById(guide._id).populate("user");

    return res.status(200).json({
      success: true,
      message: "Guide updated successfully",
      guide: updatedGuide,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// guide delete the his/her account

exports.deleteGuide = async (req, res) => {
  try {
    const guide = await Tour.findOne({ user: req.user._id });
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide was not found",
      });
    }

    await Tour.findByIdAndDelete(guide._id);
    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Guide account has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// admin delete the guide
exports.deleteGuideByAdmin = async (req, res) => {
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
      message: "Guide deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
