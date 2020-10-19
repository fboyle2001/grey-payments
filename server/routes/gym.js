// Get express and the defined models for use in the endpoints
const express = require("express");
const router = express.Router();
const { User, GymMembership } = require("../database.models.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const { v4: uuidv4 } = require("uuid");

router.get("/", async (req, res) => {
  const { user } = req.session;

  const existingEntries = await GymMembership.findAll({ where: { userId: user.id } });
  res.status(200).json({ existingEntries });
});

// Called when a POST request is to be served at /api/gym/create_stripe_checkout
// This will be used to get the user to the Stripe checkout
router.post("/create_stripe_checkout", async (req, res) => {
  const { user } = req.session;
  const rawOption = req.body.option;

  // Validate that the option is an integer and between the required options
  if(rawOption == null) {
    return res.status(400).json({ message: "Missing membership option" });
  }

  let option;

  try {
    option = parseInt(rawOption);
  } catch (error) {
    return res.status(400).json({ message: "Expected option to be an integer" });
  }

  if(!Number.isInteger(option)) {
    return res.status(400).json({ message: "Expected option to be an integer" });
  }

  if(option < 0 || option > 2) {
    return res.status(400).json({ message: "Invalid option selected" });
  }

  // Stores the names and unit price of each option
  // Might be worth externalising these to a config or something
  const membershipOptions = [
    {
      name: "1 Term Gym Membership",
      unit_amount: 3000
    },
    {
      name: "2 Term Gym Membership",
      unit_amount: 5500
    },
    {
      name: "Full Year Gym Membership",
      unit_amount: 8000
    }
  ];

  // Connects to Stripe to generate the checkout page
  const session = await stripe.checkout.sessions.create({
    customer_email: `${user.username}@durham.ac.uk`,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: membershipOptions[option].name
          },
          unit_amount: membershipOptions[option].unit_amount
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/failure"
  });

  // Sends the session ID back so the user can navigate to the page
  res.status(200).json({ id: session.id });
});

// Set the module export to router so it can be used in server.js
// Allows it to be assigned as a route
module.exports = router;
