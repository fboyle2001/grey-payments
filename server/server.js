// dotenv is used to access environment vars via process.env.<NAME>
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Users, GymMemberships } = require("./database.models.js");

// Load express
const app = express();

// Needed to manage Cross-Origin Resource Sharing

// Tells express to recognise incoming requests as JSON
app.use(express.json());
// Manages CORS headers to prevent errors
app.use(cors());

// Initialise the tables
(async() => {
  await Users.sync();
  await GymMemberships.sync();
})();

const testRoute = require("./routes/test");
app.use("/", testRoute);

app.listen(process.env.EXPRESS_PORT, () => console.log(`Server started on ${process.env.EXPRESS_PORT}`));
