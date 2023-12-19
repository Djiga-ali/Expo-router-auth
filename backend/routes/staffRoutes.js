const express = require("express");
const {
  addNewEmployee,
  getStaffMembers,
  getSingleStaffMember,
  changeStaffMemberStatus,
  changeJobPositionMemberStatus,
  getAndSearchStaff,
} = require("../controllers/staffController");
const {
  onlyLoginUserAccess,
  onlyAdmin,
  onlyStaff,
} = require("../middlewares/forLoggedInUser");
const router = express.Router();

router.post("/create", onlyLoginUserAccess, onlyAdmin, addNewEmployee);
router.patch(
  "/change-status",
  onlyLoginUserAccess,
  onlyAdmin,
  changeStaffMemberStatus
);
router.patch(
  "/change-jobPosition",
  onlyLoginUserAccess,
  onlyAdmin,
  changeJobPositionMemberStatus
);
router.get("/get-all-staff", onlyLoginUserAccess, onlyStaff, getStaffMembers);
router.get(
  "/get-one-staff",
  onlyLoginUserAccess,
  onlyStaff,
  getSingleStaffMember
);
router.get("/search-staff", onlyLoginUserAccess, onlyStaff, getAndSearchStaff);
module.exports = router;
