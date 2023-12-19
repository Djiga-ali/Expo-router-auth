const express = require("express");
const {
  accessOrCreateChat,
  accessOrCreateStaffChat,
  // accessOrCreateShopChat,
  accessOrCreateMultiChat,
  getUserChats,
  getStaffChats,
  getStaffAndUserChats,
  createGroupChat,
  createStaffGroupChat,
  blockUser,
  unBlockUser,
  createMultiGroupChat,
  createMultiGroupChatForSelectedUsers,
} = require("../controllers/multiChatController");
const {
  onlyLoginUserAccess,
  onlyStaff,
} = require("../middlewares/forLoggedInUser");

const router = express.Router();

router.post("/create", onlyLoginUserAccess, accessOrCreateChat);
router.patch("/block", onlyLoginUserAccess, blockUser);
router.patch("/unblock", onlyLoginUserAccess, unBlockUser);
router.post("/group-chat", onlyLoginUserAccess, createGroupChat);
router.post("/staff-group", onlyLoginUserAccess, createStaffGroupChat);
router.post("/multichat-group", onlyLoginUserAccess, createMultiGroupChat);
router.post(
  "/multichat-select",
  onlyLoginUserAccess,
  createMultiGroupChatForSelectedUsers
);
router.post(
  "/staff-chat",
  onlyLoginUserAccess,
  // onlyStaff,
  accessOrCreateStaffChat
);
router.post(
  "/multichat",
  onlyLoginUserAccess,
  // onlyStaff,
  accessOrCreateMultiChat
);
router.get("/chats", onlyLoginUserAccess, getUserChats);
router.get("/staff-chats", onlyLoginUserAccess, getStaffChats);
router.get("/staff-user-chats", onlyLoginUserAccess, getStaffAndUserChats);

module.exports = router;
