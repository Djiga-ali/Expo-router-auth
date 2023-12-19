const {
  createConnectAccount,
  getAccountStatus,
  getAccountBalance,
  payoutSetting,
  stripeSessionId,
  createPaymentIntent,
  transferMoneyToSellers,
  cancelTransferFromAdmin,
  testHandleOrderArray,
  changeItemQty,
} = require("../controllers/stripeController");
const { onlyLoginUserAccess } = require("../middlewares/forLoggedInUser");

const router = require("express").Router();
router.post(
  "/create-connect-account",
  onlyLoginUserAccess,
  createConnectAccount
);
router.post("/get-account-status", onlyLoginUserAccess, getAccountStatus);
router.post("/get-account-balance", onlyLoginUserAccess, getAccountBalance);
router.post("/payout-setting", onlyLoginUserAccess, payoutSetting);
router.post("/stripe-session-id", onlyLoginUserAccess, stripeSessionId);
// Create stripe payment Intent
router.post("/create-payment-intent", onlyLoginUserAccess, createPaymentIntent);
router.post("/transfer", onlyLoginUserAccess, transferMoneyToSellers);
router.patch("/cancel-transfer", onlyLoginUserAccess, cancelTransferFromAdmin);
// test
router.put("/test", testHandleOrderArray);
router.post("/change-qty", changeItemQty);

module.exports = router;
