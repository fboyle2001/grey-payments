// dotenv is used to access environment vars via process.env.<NAME>
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { User, GymMembership } = require("./database.models.js");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");

// Load express
const app = express();

// Needed to manage Cross-Origin Resource Sharing

// Tells express to recognise incoming requests as JSON
app.use(express.json());
// Manages CORS headers to prevent errors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// Allows us to manage cookies
app.use(cookieParser());

// Initialise the tables
(async() => {
  await User.sync();
  await GymMembership.sync();
})();

app.use("/api/authenticate", authRoute);

app.use("/check", (req, res, next) => {
  console.log(req.cookies);
});

// Listen for requests on the port specified in the .env file
app.listen(process.env.EXPRESS_PORT, () => console.log(`Server started on ${process.env.EXPRESS_PORT}`));
