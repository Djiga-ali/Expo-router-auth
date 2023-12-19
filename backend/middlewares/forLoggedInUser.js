const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Shop = require("../models/Shop");
const Staff = require("../models/Staff");

// / All loggedIn users *****************************************************
exports.onlyLoginUserAccess = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (user.status === "Suspended") {
    suspendedUserMsg(req, res, user);
    // res.status(400).json({ message: "You are supended " });
  } else {
    req.user = user;
    req.role = req.user.role;
    req.type = req.user.type;
    req.status = req.user.status;
    // req.staff = req.user.isStaff === true;

    const userShop = await Shop.findOne({ owner: req.user._id });
    req.user.shop = userShop;
    // console.log("req.user.shop:", req.user.shop);

    const staffMember = await Staff.findOne({ staff: req.user._id });
    req.staff = staffMember;
    // console.log("req.staff:", req.staff);

    next();
  }
};

// Acss by user  status ***************************************
exports.onlySubscriber = async (req, res, next) => {
  if (
    req.status === "Subscriber" ||
    req.staff.jobPosition === "Staff" ||
    req.staff.jobPosition === "Manager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    console.log("req.role:", req.role);
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyPremium = async (req, res, next) => {
  if (
    req.status === "Premium" ||
    req.staff.jobPosition === "Staff" ||
    req.staff.jobPosition === "Manager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

// EAC Acess by staff  status *********************************************

exports.onlyStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "Staff" ||
    req.staff.jobPosition === "Manager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

// EAC MAnager
exports.onlyManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "Manager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

// Admin
exports.onlyAdmin = async (req, res, next) => {
  // if ((req.user && req.staff.jobPosition === "Admin") || req.role === "Admin") {
  if (req.role === "Admin") {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

//   By Country Staff *******************************************************

// Burundi ********

exports.onlyBdiStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "BdiStaff" ||
    req.staff.jobPosition === "BdiManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyBdiManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "BdiManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

//   Rwanda
exports.onlyRwdStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "RwdStaff" ||
    req.staff.jobPosition === "RwdManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyRwdManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "RwdManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

//   RDC
exports.onlyDrcStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "DrcStaff" ||
    req.staff.jobPosition === "DrcManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyDrcManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "DrcManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

//   Kenya
exports.onlyKnyStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "KnyStaff" ||
    req.staff.jobPosition === "KnyManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyKnyManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "KnyManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

// Tanzania
exports.onlyTzStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "TzStaff" ||
    req.staff.jobPosition === "TzManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyTzManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "TzManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

// Uganda ********************************
exports.onlyUgdStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "UgdStaff" ||
    req.staff.jobPosition === "UgdManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlyUgdManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "UgdManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

// South Sudan *******************************************
exports.onlySudanStaff = async (req, res, next) => {
  if (
    req.staff.jobPosition === "SudanStaff" ||
    req.staff.jobPosition === "SudanManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};

exports.onlySudanManager = async (req, res, next) => {
  if (
    req.staff.jobPosition === "SudanManager" ||
    req.staff.jobPosition === "Admin" ||
    req.role === "Admin"
  ) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized" });
  }
};
