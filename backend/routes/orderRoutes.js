const express = require("express");
const {
  createNewOrder,
  uniqueStripeAccountIdTest,
} = require("../controllers/orderController");
const { onlyLoginUserAccess } = require("../middlewares/forLoggedInUser");
const router = express.Router();

router.post("/create", onlyLoginUserAccess, createNewOrder);
router.get("/test", uniqueStripeAccountIdTest);

module.exports = router;
