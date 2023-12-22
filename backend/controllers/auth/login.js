const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  matchPasswordErrorMsg,
} = require("../../utlis/error/login/loginErrorMsg");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Please  password required" });
  }
  if (!email) {
    return res
      .status(400)
      .json({ message: "Please   email or phone or username is required" });
  }

  const user = await User.findOne({ email }).exec();
  // console.log("user :", user);

  const match = await bcrypt.compare(password, user.password);

  if (!match) matchPasswordErrorMsg(req, res, user);

  if (user && match) {
    user.password = undefined;

    const accessToken = jwt.sign(
      { _id: user._id },
      // { _id: user._id, user },
      process.env.ACCESS_JWT_SECRET,
      {
        expiresIn: "60s",
        // expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      // { _id: user._id, user },

      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("token", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    res.status(200).json({ accessToken, refreshToken, user });
  }
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
// Refresh for expo react native
exports.refreshForMobile = (req, res) => {
  const { myRefreshToken } = req.params;

  if (!myRefreshToken) return res.status(401).json({ message: "Unauthorized" });

  // const refreshToken = cookies.token;

  jwt.verify(
    myRefreshToken,
    process.env.REFRESH_JWT_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const user = await User.findOne({ _id: decoded._id }).exec();

      if (!user) return res.status(401).json({ message: "Unauthorized" });
      user.password = undefined;

      const accessToken = jwt.sign(
        { _id: user._id },
        // { _id: user._id, user },
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: "1m" }
      );

      res.json({ accessToken, user });
    }
  );
};
exports.getLoggedInUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById({ _id: userId }).exec();
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  user.password = undefined;

  res.status(200).json(user);
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
exports.logoutUser = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) return res.sendStatus(204); //No content
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "logout successfully" });
};
