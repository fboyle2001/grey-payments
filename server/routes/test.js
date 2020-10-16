const express = require("express");
const router = express.Router();

// Called when a GET request is served without data
// Will get all of the tuples in the table
router.get("/", async (req, res) => {
  res.json({success: true});
});

module.exports = router;
