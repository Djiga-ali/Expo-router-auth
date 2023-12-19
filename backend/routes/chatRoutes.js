const express = require("express");
const { onlyLoginUserAccess } = require("../middlewares/forLoggedInUser");
const {
  accessOrCreateNewChat,
  getUserChats,
  createGroupChat,
  renameChatGroup,
  removeUserFromGroup,
  addUserToChatGroup,
  blockUserOne,
  blockUserTwo,
  unBlockUserOne,
  unBlockUserTwo,
} = require("../controllers/chatController");
const router = express.Router();

router.post("/create", onlyLoginUserAccess, accessOrCreateNewChat);
router.get("/user-chats", onlyLoginUserAccess, getUserChats);
router.post("/create-group-chat", onlyLoginUserAccess, createGroupChat);
router.put("/rename-chat-group", onlyLoginUserAccess, renameChatGroup);
router.put("/remove-user", onlyLoginUserAccess, removeUserFromGroup);
router.put("/add-user", onlyLoginUserAccess, addUserToChatGroup);
router.put("/block-user-one", onlyLoginUserAccess, blockUserOne);
router.put("/block-user-two", onlyLoginUserAccess, blockUserTwo);
router.put("/unblock-user-one", onlyLoginUserAccess, unBlockUserOne);
router.put("/unblock-user-two", onlyLoginUserAccess, unBlockUserTwo);

module.exports = router;
