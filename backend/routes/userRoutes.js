const express = require("express");
const {
  onlyLoginUserAccess,
  onlyStaff,
  onlyManager,
  onlyAdmin,
} = require("../middlewares/forLoggedInUser");
const {
  getAllUsers,
  getAndSearchUsers,
  getUser,
  updateUser,
  deleteUser,
  upgradeUserRole,
  deleteUserByAdmin,
  changeUserStatus,
  getUsersByGender,
  getUsersByContry,
  getUsersByState,
  getUsersByType,
  getUsersByRole,
  getUsersByStatus,
  getUsersAge,
} = require("../controllers/userController");
const router = express.Router();

// user data
router.get("/get-users", onlyLoginUserAccess, onlyStaff, getAllUsers);
router.get("/by-gender", onlyLoginUserAccess, onlyStaff, getUsersByGender);
router.get("/by-country", onlyLoginUserAccess, onlyStaff, getUsersByContry);
router.get("/by-state", onlyLoginUserAccess, onlyStaff, getUsersByState);
router.get("/by-type", onlyLoginUserAccess, onlyStaff, getUsersByType);
router.get("/by-role", onlyLoginUserAccess, onlyManager, getUsersByRole);
router.get("/by-status", onlyLoginUserAccess, onlyStaff, getUsersByStatus);
router.get("/by-age", onlyLoginUserAccess, onlyStaff, getUsersAge);
router.get("/search-users", onlyLoginUserAccess, getAndSearchUsers);
router.get("/get-user", onlyLoginUserAccess, getUser);
router.patch("/update-user", onlyLoginUserAccess, updateUser);
router.delete("/delete-user", onlyLoginUserAccess, deleteUser);
router.delete(
  "/delete-one-user",
  onlyLoginUserAccess,
  onlyAdmin,
  deleteUserByAdmin
);
// router.delete("/delete-user/:id", onlyLoginUserAccess, onlyAdmin, deleteUser);
router.post("/upgrade-user", onlyLoginUserAccess, onlyAdmin, upgradeUserRole);
router.patch(
  "/change-status",
  onlyLoginUserAccess,
  onlyAdmin,
  changeUserStatus
);

module.exports = router;
