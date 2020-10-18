// Get express and the defined models for use in the endpoints
const express = require("express");
const router = express.Router();
const { User, GymMembership } = require("../database.models.js");

router.get("/", async (req, res) => {
  const { user } = req.session;

  const existingEntries = await GymMembership.findAll({ where: { userId: user.id } }); 
  res.status(200).json({ existingEntries });
});

// Called when a POST request is to be served at /api/gym/
router.post("/", async (req, res) => {
  const { user } = req.session;
});

// Set the module export to router so it can be used in server.js
// Allows it to be assigned as a route
module.exports = router;
