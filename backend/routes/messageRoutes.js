const express = require("express");

const { onlyLoginUserAccess } = require("../middlewares/forLoggedInUser");
const {
  sendMessage,
  staffMessage,
  multiChatMessage,
  shopAndUserMessage,
  getUserMessages,
} = require("../controllers/messageController");

const router = express.Router();

// User
router.post("/send", onlyLoginUserAccess, sendMessage);
router.get("/messages/:chatId", onlyLoginUserAccess, getUserMessages);

// Staff
router.post("/staff-message", onlyLoginUserAccess, staffMessage);

// MultiChat
router.post("/multichat-message", onlyLoginUserAccess, multiChatMessage);
router.post("/shop-message", onlyLoginUserAccess, shopAndUserMessage);
// router.get("/get-categories", getCategories);
module.exports = router;
