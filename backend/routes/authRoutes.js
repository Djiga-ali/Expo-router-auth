const express = require("express");
const { registerNewUser } = require("../controllers/auth/registerUser");
const { activateNewUser } = require("../controllers/auth/Activate");
const {
  loginUser,
  logoutUser,
  refreshForMobile,
  getLoggedInUser,
  // login,
} = require("../controllers/auth/login");
const {
  forgotPassword,
  setNewPassword,
} = require("../controllers/auth/forgotPassword");
const { onlyLoginUserAccess } = require("../middlewares/forLoggedInUser");
const { changePassword } = require("../controllers/auth/changePassword");
const router = express.Router();

router.post("/create", registerNewUser);
router.post("/activate", activateNewUser);
router.post("/login", loginUser);
router.get("/get-user/:userId", getLoggedInUser);
router.get("/refresh/:myRefreshToken", refreshForMobile);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:forgotPasswordToken", setNewPassword);
router.patch("/change-password", onlyLoginUserAccess, changePassword);

module.exports = router;
