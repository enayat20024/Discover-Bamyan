require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("./config/passport");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/postRoute");
const recommendRoutes = require("./routes/recommendRoute");
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const bookingRoutes = require("./routes/bookingRoute");
const tranportRoutes = require("./routes/transportRoute");
const authMiddleware = require("./Middleware/auth");
const userMiddleware = require("./Middleware/user");

const connectDB = require("./config/db");
// Create Express app
const app = express();

// Serve static files from the public directory
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use(express.static(path.join(__dirname, "./bamyan-frontend/build")));
// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configure session middleware

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret used to sign the session ID cookie
    resave: false, // Do not save sessions if they have not been modified
    saveUninitialized: false, // Do not save uninitialized sessions
  }),
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Make connection to MongoDB Atlas with mongoose

//Midlewares
// Use the user middleware
// app.use(authMiddleware);
// app.use(userMiddleware);
//routes

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/recommend", recommendRoutes);
app.use("/api/v1/auth", authMiddleware, authRoutes);
app.use("/api/v1/post", authMiddleware, postRoutes);
app.use("/api/v1/booking", authMiddleware, bookingRoutes);
app.use("/api/v1/transport", authMiddleware, tranportRoutes);

app.use("/api/v1/user", userRoutes);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./bamyan-frontend/build/index.html"));
});
// Apply the authentication middleware

//port

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    console.log("Starting server...");

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
