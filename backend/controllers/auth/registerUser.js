const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.CRYPTR_KEY);
const cloudinary = require("../../config/cloudinary");

const validator = require("email-validator");
const { firstNameValidation } = require("../../utlis/error/auth/firstName");
const { lastNameValidation } = require("../../utlis/error/auth/lastName");
const {
  countryValidation,
} = require("../../utlis/error/auth/countryValidation");
const { stateValidation } = require("../../utlis/error/auth/stateValidation");
const { phoneValidation } = require("../../utlis/error/auth/phoneValidation");
const { emailValidation } = require("../../utlis/error/auth/emailValidation");
const {
  passwordValidation,
  passwordLengthValidation,
} = require("../../utlis/error/auth/passwordValidation");
const {
  existingUserValidation,
} = require("../../utlis/error/auth/existingUserValidation");
const {
  sentEmailSuccessMessage,
} = require("../../utlis/sendEmail/VerificationEmailSuccessMsg");
const { contentMessage } = require("../../utlis/sendEmail/contentMessage");
const sendEmail = require("../../utlis/sendEmail/sendEmail");

exports.registerNewUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    country,
    state,
    type,
    status,
    language,
    genre,
    profileImage,
  } = req.body;

  // validataion
  if (!first_name) {
    firstNameValidation(req, res, country, language);
  }
  if (!last_name) {
    lastNameValidation(req, res, country, language);
  }

  if (!language) {
    return res.json({ message: "language is required" });
  }

  if (!country) {
    countryValidation(req, res, country, language);
  }

  if (!state) {
    stateValidation(req, res, country, language);
  }
  if (!phone) {
    phoneValidation(req, res, country, language);
  }
  if (!genre) {
    // phoneValidation(req, res, country, language);
    res.status(400).json({ message: "genre is required" });
  }

  if (!type) {
    // phoneValidation(req, res, country, language);
    res.status(400).json({ message: "type is required" });
  }

  if (!validator.validate(email)) {
    emailValidation(req, res, country, language);
  }

  if (!password) {
    passwordValidation(req, res, country, language);
  }
  if (password && password?.length < 8) {
    passwordLengthValidation(req, res, country, language);
  }

  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    existingUserValidation(req, res, country, language);
  }

  const result = await cloudinary.uploader.upload(profileImage, {
    folder: "images/profile",
    // width: 300,
    // crop: "scale"
  });

  if (
    !existingUser &&
    first_name &&
    last_name &&
    email &&
    password &&
    country &&
    state &&
    phone &&
    language &&
    genre &&
    type &&
    genre
  ) {
    const user = {
      genre,
      first_name,
      last_name,
      email,
      password,
      country,
      state,
      phone,
      type,
      language,
      profileImage: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    };

    const activationToken = jwt.sign(user, process.env.ACTIVATION_JWT_SECRET, {
      expiresIn: "1h",
    });

    const activationUrl = `http://localhost:5173/activate/${activationToken}`;
    // const activationUrl = `http://localhost:3000/activation/${activationToken}`;

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
      const subject = "Verify Your Account";
      const send_to = user.email;
      const sent_from = process.env.SMPT_MAIL;
      const reply_to = "noreply@shram.com";
      const template = "verifyEmail"; // from views/verifyEmail.handlebars
      const content = contentMessage(user);
      const name = user.first_name;
      const link = activationUrl;

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
  }
};
