// Get express and the defined models for use in the endpoints
const express = require("express");
const router = express.Router();
const { User, GymMembership, Transaction, TransactionType } = require("../database.models.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

router.get("/", async (req, res) => {
  const { user } = req.session;

  const existingEntries = await GymMembership.findAll({ where: { userId: user.id } });
  return res.status(200).json({ existingEntries });
});

router.get("/all", async (req, res) => {
  const { user } = req.session;

  if(!user.admin) {
    return res.status(403).json({ message: "Admin access only" });
  }

  let memberships;

  try {
    memberships = await GymMembership.findAll({
      include: [ User ],
      order: [
        ["createdAt", "DESC"]
      ]
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error: Unable to query database for memberships" });
  }

  return res.status(200).json({ memberships });
});

// Called when a POST request is to be served at /api/gym/create_stripe_checkout
// This will be used to get the user to the Stripe checkout
router.post("/create_stripe_checkout", async (req, res) => {
  const { user } = req.session;

  // Create a new Transaction and get its UUID
  const transaction = await Transaction.create({
    userId: user.id,
    type: TransactionType.gymMembership
  });

  // ** ADD ERROR CHECKING **

  const uuid = transaction.id;

  // Connects to Stripe to generate the checkout page
  const session = await stripe.checkout.sessions.create({
    customer_email: `${user.username}@durham.ac.uk`,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Full Year Gym Membership"
          },
          unit_amount: 8000
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `http://localhost:3000/payments/success/${uuid}`,
    cancel_url: `http://localhost:3000/payments/failure/${uuid}`
  });

  // Sends the session ID back so the user can navigate to the page
  res.status(200).json({ id: session.id });
});

// Set the module export to router so it can be used in server.js
// Allows it to be assigned as a route
module.exports = router;
