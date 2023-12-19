const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const validator = require("email-validator");
const {
  forgotPasswordMsg,
} = require("../../utlis/sendEmail/forgotPasswordMsg");
const sendEmail = require("../../utlis/sendEmail/sendEmail");
const {
  sentEmailSuccessMessage,
} = require("../../utlis/sendEmail/VerificationEmailSuccessMsg");
const {
  changeForgotPasswordSuccessMsg,
} = require("../../utlis/success/changeForgotPasswordSuccessMsg");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!validator.validate(email)) {
    res.status(404).json({ message: "Valid email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "No user found" });
  }

  const forgotPasswordToken = jwt.sign(
    { _id: user._id },
    process.env.FORGOT_PASSWORD_TOKEN,
    {
      expiresIn: "1h",
    }
  );

  const forgotPassword = `http://localhost:5173/forgot-password/${forgotPasswordToken}`;
  //   const activationUrl = `http://localhost:3000/forgot-password/${forgotPasswordToken}`;

  // Send Email
  const userCountry = [
    "Burundi",
    "Rwanda",
    "RDC",
    "Tanzania",
    "Uganda",
    "Kenya",
    "South Sudan",
  ];

  const userLanguage = [
    "Kiswahili",
    "Ikirundi",
    "Ikinyarwanda",
    "Lingala",
    "Luganda",
    "Français",
    "English",
  ];

  const selectLanguge =
    user.language === userLanguage[0] ||
    user.language === userLanguage[1] ||
    user.language === userLanguage[2] ||
    user.language === userLanguage[3] ||
    user.language === userLanguage[4] ||
    user.language === userLanguage[5] ||
    user.language === userLanguage[6];

  const selectCountry =
    user.country === userCountry[0] ||
    user.country === userCountry[1] ||
    user.country === userCountry[2] ||
    user.country === userCountry[3] ||
    user.country === userCountry[4] ||
    user.country === userCountry[5] ||
    user.country === userCountry[6];

  if (selectCountry && selectLanguge) {
    const subject = "Set new password";
    const send_to = user.email;
    const sent_from = process.env.SMPT_MAIL;
    const reply_to = "noreply@shram.com";
    const template = "forgotPassword"; // from views/verifyEmail.handlebars
    const content = forgotPasswordMsg(user);
    const name = user.first_name;
    const link = forgotPassword;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      content,
      name,
      link
    );

    sentEmailSuccessMessage(req, res, user);
  } else {
    res.status(200).json({
      message: "Please Fill correctly the Country ou Language",
    });
  }
};

exports.setNewPassword = async (req, res) => {
  const { forgotPasswordToken } = req.params;
  const { password } = req.body;

  const decoded = jwt.verify(
    forgotPasswordToken,
    process.env.FORGOT_PASSWORD_TOKEN
  );

  const user = await User.findById({ _id: decoded._id });
  //   console.log(user);

  user.password = password;
  await user.save();

  if (user) {
    changeForgotPasswordSuccessMsg(req, res, user);
  }
};
