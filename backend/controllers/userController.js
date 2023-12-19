const User = require("../models/User");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const cloudinary = require("../config/cloudinary");

// Get All users

exports.getAllUsers = async (req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};

// For chat  : get or Search users
exports.getAndSearchUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { first_name: { $regex: req.query.search, $options: "i" } },
          { last_name: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  //   $ne: req.user._id : le user qui fait les recherce n'appartra pas dans le resultat
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json(users);
};

// Get user
exports.getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Update user

exports.updateUser = async (req, res) => {
  // const {

  // } = req.body;

  const {
    genre,
    first_name,
    last_name,
    country,
    state,
    city,
    phone,
    avatar,
    type,
    language,
    bio,
    profileImage,
  } = req.body;

  const userToUpdate = await User.findById({ _id: req.user._id });
  // console.log("userToUpdate._id:", userToUpdate._id);

  // NB: if no first_name // last_name ... to if I can use it here
  // Handling profile Image updating
  let imageBuffer = {};

  if (req.body.profileImage !== "") {
    const ImgId = userToUpdate.profileImage.public_id;
    if (ImgId) {
      await cloudinary.uploader.destroy(ImgId);
    }

    const newImage = await cloudinary.uploader.upload(profileImage, {
      folder: "images/profile",
      // width: 1000,
      // crop: "scale"
    });

    imageBuffer = {
      public_id: newImage.public_id,
      url: newImage.secure_url,
    };
  }

  req.body.profileImage = imageBuffer;

  const updatedUser = await User.findByIdAndUpdate(
    // const updatedUser = User.findOneAndUpdate(
    { _id: userToUpdate._id },
    {
      genre,
      first_name,
      last_name,
      country,
      state,
      city,
      phone,
      avatar,
      type,
      language,
      bio,
      profileImage,
    },
    { new: true }
  );

  const user = await User.findById({ _id: updatedUser._id });
  if (user) {
    res.status(200).json({ message: "update success" });
  } else {
    res.status(400).json({ message: "update fail" });
  }
};

// DElete user onlyLoggedIn user
exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  const userShop = await Shop.findById({ _id: req.user.shop._id });
  const shopProducts = await Product.find({ shop: userShop._id });

  if (user) {
    const userTodelete = await User.findByIdAndDelete({ _id: user._id });

    if (!userTodelete) {
      res.status(404).json({ message: "User not found" });
    }

    if (userShop && shopProducts) {
      await Product.deleteMany({ shop: userShop._id });
      await Shop.findByIdAndDelete({ _id: userShop._id });
    } else if (userShop) {
      await Shop.findByIdAndDelete({ _id: userShop._id });
    }

    res.status(200).json({
      message: "Good bye dear member! You are no longer Shram member",
    });
  } else {
    res
      .status(400)
      .json({ message: "You are not allowed to delete this user" });
  }
};

// DElete user onlyAdmin
exports.deleteUserByAdmin = async (req, res) => {
  const { userId } = req.body;
  // const { id } = req.params;
  const userShop = await Shop.findOne({ owner: userId });
  const shopProducts = await Product.find({ shop: userShop._id });

  if (req.role === "Admin") {
    const userTodelete = await User.findByIdAndDelete({ _id: userId });

    if (!userTodelete) {
      res.status(404).json({ message: "User not found" });
    }

    if (userShop && shopProducts) {
      await Product.deleteMany({ shop: userShop._id });
      await Shop.findByIdAndDelete({ _id: userShop._id });
    } else if (userShop) {
      await Shop.findByIdAndDelete({ _id: userShop._id });
    }

    res.status(200).json({
      message: "User removed successfully",
    });
  } else {
    res.status(400).json({ message: "Not allowed" });
  }
};

// Upgrade user
exports.upgradeUserRole = async (req, res) => {
  const { role, userId } = req.body;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  user.role = role;
  await user.save();

  if (user) {
    res.status(200).json({
      message: `User role updated to ${role}`,
    });
  }
};

// change User Status:
exports.changeUserStatus = async (req, res) => {
  const { userStatus, userId } = req.body;
  const user = await User.findById({ _id: userId });
  const userShop = await Shop.findOne({ owner: userId });
  const shopProducts = await Product.find({ shop: userShop._id });
  console.log("shopProducts:", shopProducts);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    // await User.findByIdAndUpdate({ _id: user._id }, { status: userStatus });
    user.status = userStatus;
    await user.save();

    if (userStatus === "Suspended" && userShop && shopProducts) {
      await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        { shopStatus: "Suspended" }
      );
      // Afaire demain ***************
      await Product.updateMany(
        { shop: userShop._id },
        { productStatus: "Suspended" }
      );
    } else if (userStatus === "Suspended" && userShop) {
      await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        { shopStatus: "Suspended" }
      );
    }

    // Subscriber
    if (userStatus === "Subscriber" && userShop && shopProducts) {
      await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        { shopStatus: "Subscriber" }
      );
      // Afaire demain ***************
      await Product.updateMany(
        { shop: userShop._id },
        { productStatus: "Subscriber" }
      );
    } else if (userStatus === "Subscriber" && userShop) {
      await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        { shopStatus: "Subscriber" }
      );
    }
    //
    if (userStatus === "Premium" && userShop && shopProducts) {
      await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        { shopStatus: "Premium" }
      );
      // Afaire demain ***************
      await Product.updateMany(
        { shop: userShop._id },
        { productStatus: "Premium" }
      );
    } else if (userStatus === "Premium" && userShop) {
      await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        { shopStatus: "Premium" }
      );
    }
  }

  // user.status = status;
  // await user.save();
  if (user) {
    res.status(200).json({
      message: `User status changed`,
    });
  }
};

// Get user by gender
exports.getUsersByGender = async (req, res) => {
  const { gender } = req.body;
  const users = await User.find({ genre: gender })
    .sort("-createdAt")
    .select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};

// Get users by contry with countrySatff protected route
exports.getUsersByContry = async (req, res) => {
  const { country } = req.body;
  const users = await User.find({ country })
    .sort("-createdAt")
    .select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};

// Get users by state
exports.getUsersByState = async (req, res) => {
  const { state } = req.body;
  const users = await User.find({ state })
    .sort("-createdAt")
    .select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};

// Get users by type
exports.getUsersByType = async (req, res) => {
  const { type } = req.body;
  const users = await User.find({ type })
    .sort("-createdAt")
    .select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};

// Get users by roles
exports.getUsersByRole = async (req, res) => {
  const { role } = req.body;
  const users = await User.find({ role })
    .sort("-createdAt")
    .select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};
// Get users by status
exports.getUsersByStatus = async (req, res) => {
  const { status } = req.body;
  const users = await User.find({ status })
    .sort("-createdAt")
    .select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};

// Gets users by ages
exports.getUsersAge = async (req, res) => {
  const { age } = req.body;
  const users = await User.find({ age }).sort("-createdAt").select("-password");

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: "No Users  found" });
  }
};
