const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { successMessage } = require("../../utlis/success/newUserSuccessMsg");

exports.activateNewUser = async (req, res) => {
  const {
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
    profileImage,
  } = jwt.verify(req.body.activationToken, process.env.ACTIVATION_JWT_SECRET);

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ error: "Email is taken" });
  }
  const user = await new User({
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
    profileImage,
    isVerified: true,
  }).save();

  // console.log(user.country, user.language);
  if (user) {
    successMessage(req, res, user);
  }
};
