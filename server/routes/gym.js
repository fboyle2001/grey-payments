// Get express and the defined models for use in the endpoints
const express = require("express");
const router = express.Router();
const { User, GymMembership, Transaction, TransactionType } = require("../database.models.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const { user } = req.session;

  const membership = await GymMembership.findOne({ where: { userId: user.id } });

  if(membership === null) {
    return res.status(200).json({ hasMembership: false });
  }

  return res.status(200).json({ hasMembership: true, membership });
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

  // We sign the success and failure tokens in JWTs
  // this is needed to prevent them taking the UUID and navigating to
  // success page if their payment actually failed

  const jwtExpiry = process.env.JWT_EXPIRY;

  const successJWT = jwt.sign({ transactionId: uuid, success: true }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: jwtExpiry
  });

  const failureJWT = jwt.sign({ transactionId: uuid, success: false }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: jwtExpiry
  });

  console.log("success", successJWT);
  console.log("failure", failureJWT);

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
    success_url: `${process.env.WEB_ADDRESS}/payments/success/${successJWT}`,
    cancel_url: `${process.env.WEB_ADDRESS}/payments/failure/${failureJWT}`
  });

  // Sends the session ID back so the user can navigate to the page
  res.status(200).json({ id: session.id });
});

// Set the module export to router so it can be used in server.js
// Allows it to be assigned as a route
module.exports = router;
