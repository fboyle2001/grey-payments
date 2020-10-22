// Get express and the defined models for use in the endpoints
const express = require("express");
const router = express.Router();
const { User, GymMembership, Transaction, TransactionType } = require("../database.models.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

// Called when a POST request is to be served at /api/payments/failure
router.post("/failure", async (req, res) => {
  const transactionId = req.body.transactionId;

  if(transactionId == null) {
    return res.status(400).json({ message: "Missing transaction ID" });
  }

  let transaction;

  try {
    transaction = await Transaction.findOne({ where: { id: transactionId } });
  } catch (error) {
    return res.status(500).json({ message: "Server error: Unable to query database" });
  }

  if(transaction == null) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  if(transaction.completed) {
    return res.status(400).json({ message: "Transaction already completed" });
  }

  transaction.completed = true;
  transaction.successful = false;

  try {
    await transaction.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error: Unable to update transaction" });
  }

  return res.status(200).json({ message: "Transaction completed" });
});

// Called when a POST request is to be served at /api/payments/success
router.post("/success", async (req, res) => {
  const transactionId = req.body.transactionId;

  if(transactionId == null) {
    return res.status(400).json({ message: "Missing transaction ID" });
  }

  let transaction;

  try {
    transaction = await Transaction.findOne({ where: { id: transactionId } });
  } catch (error) {
    return res.status(500).json({ message: "Server error: Unable to query database" });
  }

  if(transaction == null) {
    return res.status(400).json({ message: "Invalid transaction ID" });
  }

  if(transaction.completed) {
    return res.status(400).json({ message: "Transaction already completed" });
  }

  switch(transaction.type) {
    case TransactionType.gymMembership:
      let membership;

      try {
        membership = await createNewGymMembership(transaction.userId);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error: Error creating membership" });
      }

      break;
    case TransactionType.unknown:
    default:
      return res.status(500).json({ message: "Server error: Unknown transaction type" });
  }

  transaction.completed = true;
  transaction.successful = true;

  try {
    await transaction.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error: Unable to update transaction" });
  }

  return res.status(200).json({ message: "Transaction completed" });
});

createNewGymMembership = async (userId) => {
  const membership = await GymMembership.create({ userId });
  return membership;
}

// Set the module export to router so it can be used in server.js
// Allows it to be assigned as a route
module.exports = router;
