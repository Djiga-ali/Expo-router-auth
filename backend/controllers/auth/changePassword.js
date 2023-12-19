const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const validator = require("email-validator");
const {
  passwordErrorMsg,
  samePasswordErrorMsg,
  noMatchPasswordErrorMsg,
} = require("../../utlis/error/auth/protectedAccess/changePasswordErrorMsg");
const {
  changeForgotPasswordSuccessMsg,
} = require("../../utlis/success/changeForgotPasswordSuccessMsg");

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404).json({ message: "No user found" });
  }

  if (!oldPassword || !newPassword) {
    passwordErrorMsg(req, res, user);
  }
  if (oldPassword === newPassword) {
    samePasswordErrorMsg(req, res, user);
  }

  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) noMatchPasswordErrorMsg(req, res, user);

  if (user && match) {
    user.password = newPassword;
    await user.save();

    changeForgotPasswordSuccessMsg(req, res, user);
  }
};
