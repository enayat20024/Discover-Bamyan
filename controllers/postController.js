const multer = require("multer");
const path = require("path");
const Post = require("../Models/post");
const storage = multer.diskStorage({
  destination: "./public/uploads/", // Specify the directory for storing uploaded images
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

const defaultPosts = [
  {
    title: "My Bamyan dream or why I returned to Afghanistan",
    descript:
      "Would you believe me if i told you that i travelled to Afghanistan not once, but twice this year? Indeed,having paid my first visit to Afghanistan less than six months before, I travelled to Afghanistan for a repeat trip in October 2018.",
    imageUrl:
      "/assets/posts/blog-my-bamyan-dream-or-why-i-returned-to-afghanistan/vb_DSC_0292.jpg",
    author: "Anna Anjci",
    date: new Date("June 3, 2020"),
  },
  {
    title: "Bamyan travel guide by The Adventures of Lil Nicki",
    descript:
      "Learn how to get to all the beautiful sites around Bamyan Province on a trip to Afghanistan (for those that dare) in this Bamyan Travel Guide by Lil Nicki.",
    imageUrl:
      "/assets/posts/blog-bamyan-travel-guide-by-lil-nicki/vb_562A0733-1.jpg",
    author: "Lil Nicki",
    date: new Date("June 3, 2020"),
  },
  {
    title: "Protecting a Hidden Treasure of Central Asia",
    descript:
      "The magnificent and peaceful Bamyan Plateau is nothing like the Afghanistan you see on the news",
    imageUrl:
      "/assets/posts/blog-protecting-a-hidden-treasure-of-central-asia/vb_01.jpg",
    author: "Stephane Ostrowski",
    date: new Date("June 3, 2020"),
  },
  {
    title: "Tourism in Bamyan after the Taliban",
    descript:
      "Bamiyan, a small Afghan mountain town best known for its blown-up Buddhas, wants to be your next holiday destination.",
    imageUrl:
      "/assets/posts/blog-tourism-after-the-taliban/vb_13-pezhman-stage.jpg",
    author: "Sune Engel Rasmussen",
    date: new Date("June 3, 2020"),
  },
];

const getAllPosts = async (req, res) => {
  try {
    const existingPosts = await Post.find();
    if (existingPosts.length === 0) {
      await Post.insertMany(defaultPosts);
      return res.status(201).json({ posts: defaultPosts });
    }
    res.status(200).json({ success: true, posts: existingPosts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please try it again when you have time to do it",
    });
  }
};

// Catching all posts for admin dashboard

const getAllPostsForAdmin = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const createPost = async (req, res) => {
  upload(req, res, async (err) => {
    const { title, descript, author, date } = req.body;
    if (err) {
      console.error(err);
      return res.status(500).send({
        success: false,
        message: err.message || "File upload error",
      });
    }
    const imageUrl = req.file ? "/uploads/" + req.file.filename : null;

    if (!title || !descript || !author || !imageUrl) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    try {
      const newPost = new Post({
        title,
        descript,
        imageUrl,
        author,
        date,
        user: req.user._id,
      });
      await newPost.save();
      res.status(201).json({
        success: true,
        message: "Post created successfully",
        post: newPost,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({
        success: false,
        message: "Send Post API Error",
      });
    }
  });
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "No Authorized to delete this",
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getPostById = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post Not Found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.user._id,
    });
    res.status(200).json({
      success: true,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Deleting the story via admin

const deleteStoryByAdmin = async (req, res) => {
  try {
    const storyId = req.params.id;
    const story = await Post.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        messsage: "Story Not Found",
      });
    }
    await Post.findByIdAndDelete(storyId);
    return res.status(200).json({
      success: true,
      message: "Story has been deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  getMyPosts,
  deletePost,
  deleteStoryByAdmin,
  getAllPostsForAdmin,
};
