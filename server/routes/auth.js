// Get express and the defined models for use in the endpoints
const express = require("express");
const router = express.Router();
const { User } = require("../database.models.js");
const axios = require("axios");

// Called when a POST request is served
router.post("/", async (req, res) => {
  // Get the username and password, verify they are both there
  const username = req.body.username;
  const password = req.body.password;

  if(username == null) {
    res.status(400).json({ message: "Missing username" });
    return;
  }

  if(password == null) {
    res.status(400).json({ message: "Missing password" });
    return;
  }

  // To validate a Durham account with CIS we need to query a specific page
  // https://www.dur.ac.uk/its/password/validator
  // Providing headers 'Authorization' = 'Basic {{base64 encoded string 'username:password'}}'

  const details = Buffer.from(`${username}:${password}`);
  const b64data = details.toString("base64");

  const authHeader = `Basic ${b64data}`;

  try {
    await axios.get("https://www.dur.ac.uk/its/password/validator", {
      headers: {
        Authorization: authHeader
      }
    });
  } catch (error) {
    // Details were incorrect or maybe a server error
    const status = error.response.status;

    if(status === 401) {
      res.status(400).json({ message: "Incorrect username or password" });
      return;
    }

    res.status(status).json({ message: "Validation error" });
  }

  // We will error if we do not receive a 200 status so we can assume we are validated from here
  // We have no need to store the password (or its hash) so can simply ignore it
  try {
    const existingUser = await User.findOne({ where: { username } });
    // Only create a new entry if one doesn't exist
    if(existingUser == null) {
      await User.create({ username });
    }
    res.status(200).json({ message: "Successfully authenticated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Set the module export to router so it can be used in server.js
// Allows it to be assigned as a route
module.exports = router;
