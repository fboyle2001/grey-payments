// dotenv is used to access environment vars via process.env.<NAME>
require("dotenv").config();

// These are required for express to work correctly
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Routes and database models
const { User, GymMembership, Transaction } = require("./database.models.js");
const authRoute = require("./routes/auth");
const gymRoute = require("./routes/gym");
const paymentsRoute = require("./routes/payments");

// Required to deploy the static React files for production
const path = require("path");

// Load express
const app = express();

// Tells express to recognise incoming requests as JSON
app.use(express.json());
// Manages CORS headers to prevent errors
app.use(cors());
// Allows express to send and receive cookies
app.use(cookieParser());

// Adapted from https://www.codementor.io/@mayowa.a/how-to-build-a-simple-session-based-authentication-system-with-nodejs-from-scratch-6vn67mcy3
// sets the settings for the session
// Be aware that if you change expires you will need to update ./routes/auth.js in the login function
// 2 hours * 60 minutes * 60 seconds * 1000 ms
app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 2 * 60 * 60 * 1000
  }
}));

// Initialise the tables
(async() => {
  await User.sync();
  await GymMembership.sync();
  await Transaction.sync();
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

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  // They are logged in if they have a valid cookie and the session recognises them
  if(req.session.user && req.cookies.user_sid) {
    return next();
  }

  res.status(401).json({ message: "Not logged in" });
  return;
};

// These are api routes that act as the backend
app.use("/api/auth", authRoute);
app.use("/api/gym", isLoggedIn, gymRoute);
app.use("/api/payments", paymentsRoute);

// Uncomment /* */ when deploying
// These are for serving production code
// The directory may need to change
/* app.use(express.static(path.join(__dirname, "../frontend/build"))); */
// Necessary since things like /gym do not actually exist they are routes
// within the index.html file
/*
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
*/

// Listen for requests on the port specified in the .env file
app.listen(process.env.EXPRESS_PORT, () => console.log(`Server started on ${process.env.EXPRESS_PORT}`));
