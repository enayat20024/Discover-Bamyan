const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { isAuthenticated, hasRole } = require("../Middleware/authorization");
const {
  updateProfileImage,
  getUserProfile,
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
  deleteUserByAdmin,
} = require("../controllers/userController");
const { createUser } = require("../controllers/authController");
const {
  createGuide,
  getAllGuides,
  getCurrentGuide,
  updateCurrentGuide,
  deleteGuide,
  deleteGuideByAdmin,
} = require("../controllers/tourController");

// STORAGE
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

function checkFileType(req, file, cb) {
  const types = /jpeg|jpg|png|gif/;

  const isExt = types.test(path.extname(file.originalname).toLowerCase());

  const isMime = types.test(file.mimetype);

  if (isExt && isMime) {
    return cb(null, true);
  }

  cb(new Error("Images only!"));
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(req, file, cb);
  },
}).single("image");

// UPDATE PROFILE IMAGE
// router.post("/user/:userId", isAuthenticated, (req, res) => {
//   upload(req, res, (err) => {
//     if (err) return res.status(400).send(err);
//     updateProfileImage(req, res);
//   });
// });

// VIEW USER PROFILE

router.get("/me", isAuthenticated, getCurrentUser);
router.get("/users", isAuthenticated, getAllUsers);
router.get("/guides", getAllGuides);
router.get("/guides/guide", isAuthenticated, getCurrentGuide);
router.put("/guides/update", isAuthenticated, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    updateCurrentGuide(req, res);
  });
});
router.delete("/guides/delete-guide", isAuthenticated, deleteGuide);
router.post(
  "/create-user",
  isAuthenticated,
  hasRole("Admin"),
  upload,
  createUser,
);
router.post(
  "/create-guide",
  isAuthenticated,
  hasRole("Admin"),
  upload,
  createGuide,
);
router.post("/update-image", isAuthenticated, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err,
      });
    }
    updateProfileImage(req, res);
  });
});
router.get("/:postId", getUserProfile);
router.put("/update", isAuthenticated, updateUser);
router.delete("/delete", isAuthenticated, deleteUser);
router.delete("/delete-user/:id", isAuthenticated, deleteUserByAdmin);
router.delete(
  "/delete-guide/:id",
  isAuthenticated,
  hasRole("Admin"),
  deleteGuideByAdmin,
);
module.exports = router;
