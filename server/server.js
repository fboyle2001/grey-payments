// dotenv is used to access environment vars via process.env.<NAME>
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { User, GymMembership } = require("./database.models.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");

// Load express
const app = express();

// Needed to manage Cross-Origin Resource Sharing

// Tells express to recognise incoming requests as JSON
app.use(express.json());
// Manages CORS headers to prevent errors
app.use(cors());

app.use(cookieParser());

// Adapted from https://www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
// sets the settings for the session
app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));

// Initialise the tables
(async() => {
  await User.sync();
  await GymMembership.sync();
})();

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
// https://www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }

  next();
});

app.use("/api/auth", authRoute);

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if(req.session.user && req.cookies.user_sid) {
    next();
  }

  res.status(401).json({ message: "Not logged in" });
  return;
};

// Listen for requests on the port specified in the .env file
app.listen(process.env.EXPRESS_PORT, () => console.log(`Server started on ${process.env.EXPRESS_PORT}`));
