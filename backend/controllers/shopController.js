const slugify = require("slugify");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const {
  activateShopEmailMsg,
} = require("../utlis/sendEmail/activateShopEmailMsg");
const {
  checkEmailMessage,
} = require("../utlis/sendEmail/ActivateShopCheckMailMsg");
const sendEmail = require("../utlis/sendEmail/sendEmail");

exports.createNewShop = async (req, res) => {
  const {
    shopName,
    shopLanguge,
    shopType,
    shopStatus,
    address,
    country,
    state,
    city,
    ownerEmail,
    businessEmail,
    businessPhone,
    owner,
    ownerPhone,
    shopLogo,
    shopBanner,
  } = req.body;

  if (
    !shopName ||
    !address ||
    !city ||
    !businessEmail ||
    !businessPhone ||
    !shopType
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUserShop = await Shop.findOne(
    { shopName } || { businessPhone } || { businessEmail } || {
        ownerEmail,
      } || { owner } || {
        ownerPhone,
      }
  );

  const user = await User.findById(req.user._id);
  user.password = undefined;

  if (existingUserShop) {
    return res.status(400).json({ message: "You already have a shop" });
  }

  const logo = await cloudinary.uploader.upload(shopLogo, {
    folder: "images/logo",
    // width: 300,
    // crop: "scale"
  });
  const banner = await cloudinary.uploader.upload(shopBanner, {
    folder: "images/banners",
    // width: 300,
    // crop: "scale"
  });
  //   For shop token
  if (
    !existingUserShop &&
    shopName &&
    shopType &&
    address &&
    city &&
    businessEmail &&
    businessPhone
  ) {
    const shop = {
      shopName,
      address,
      shopType,
      city,
      businessEmail,
      businessPhone,
      shopStatus:
        user.status === "Subscriber"
          ? "Subscriber"
          : user.status === "Premium"
          ? "Premium"
          : "active",
      shopLanguge: user.language,
      country: user.country,
      state: user.state,
      ownerEmail: user.email,
      owner: user._id,
      ownerPhone: user.phone,
      shopLogo: {
        public_id: logo.public_id,
        url: logo.secure_url,
      },
      shopBanner: {
        public_id: banner.public_id,
        url: banner.secure_url,
      },
    };

    const activateShopToken = jwt.sign(shop, process.env.SHOP_jwt_TOKEN, {
      expiresIn: "1h",
    });

    const activateShop = `http://localhost:5173/activate-shop/${activateShopToken}`;
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
      const subject = "Confirm your shop registration";
      const send_to = shop.businessEmail;
      const sent_from = process.env.SMPT_MAIL;
      const reply_to = "noreply@shram.com";
      const template = "activateShop"; // from views/verifyEmail.handlebars
      const content = activateShopEmailMsg(user);
      const name = user.first_name;
      const link = activateShop;

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

      checkEmailMessage(req, res, user);
    } else {
      res.status(200).json({
        message: "Please Fill correctly the Country ou Language",
      });
    }
  }
};

exports.activateNewShop = async (req, res) => {
  const {
    shopName,
    shopType,
    shopTypeName,
    shopStatus,
    shopLanguge,
    address,
    city,
    businessEmail,
    businessPhone,
    country,
    state,
    ownerEmail,
    owner,
    ownerPhone,
    shopLogo,
    shopBanner,
  } = jwt.verify(req.body.activateShopToken, process.env.SHOP_jwt_TOKEN);

  const existingUserShop = await Shop.findOne(
    { shopName } || { businessPhone } || { businessEmail } || {
        ownerEmail,
      } || { owner } || {
        ownerPhone,
      }
  );

  if (existingUserShop) {
    return res.json({ error: "Shop already exist" });
  }

  // const user = await User.findById(req.user._id);

  const shop = await Shop.create({
    shopName,
    shopType,
    shopTypeName,
    shopStatus,
    shopLanguge,
    address,
    country,
    state,
    city,
    businessEmail,
    businessPhone,
    slug: slugify(
      shopName + "-" + country + "-" + state + "-" + city
    ).toLowerCase(),
    ownerEmail,
    owner,
    ownerPhone,
    shopLogo,
    shopBanner,
  });

  if (shop) {
    res
      .status(201)
      .json({ message: `New shop named ${shop.shopName} created` });
  } else {
    res.status(400).json({ message: "Shop not created ! There is an error" });
  }
};

// find all shops
exports.getShops = async (req, res) => {
  const shops = await Shop.find().populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// Single shop

exports.getSingleShop = async (req, res) => {
  const { shopId } = req.params;
  const shop = await Shop.findById({ _id: shopId }).populate(
    "owner",
    "-password"
  );
  const shopProducts = await Product.find({ shop: shop }).populate({
    path: "category shop",
  });

  if (!shop) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shop && !shopProducts) {
    res.status(201).json({ message: "No products in the shop " });
  } else if (shop && shopProducts) {
    res.status(201).json({ shop, shopProducts });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// seller shop
exports.getSellerShop = async (req, res) => {
  // const { productLanguage, productType } = req.body;
  //   const { shopId } = req.params;
  const shop = await Shop.findOne({ owner: req.user._id })
    .populate("owner")
    .select("-password");

  const shopProducts = await Product.find({ shop: shop._id });

  if (!shop) {
    //created
    res.status(400).json({ message: "Only owner is allower" });
  } else if (shop && !shopProducts) {
    res.status(200).json({ shop, message: "No products in the shop " });
  } else if (shop && shopProducts) {
    res.status(200).json({ shop, shopProducts });
  } else {
    res.status(400).json({ message: "Permission denied" });
  }
};

// Update seller shop
exports.updateSellerShop = async (req, res) => {
  // const data = {
  //   shopName: req.body.shopName,
  //   shopType: req.body.shopType,
  //   shopTypeName: req.body.shopTypeName,
  //   shopLanguge: req.body.shopLanguge,
  //   address: req.body.address,
  //   country: req.body.country,
  //   state: req.body.state,
  //   city: req.body.city,

  //   businessPhone: req.body.businessPhone,

  //   shopLogo: req.body.shopLogo,
  //   shopBanner: req.body.shopBanner,
  // };
  const {
    shopName,
    shopType,
    shopTypeName,
    shopLanguge,
    address,
    country,
    state,
    city,

    businessPhone,

    shopLogo,
    shopBanner,
  } = req.body;

  if (!shopName || !address || !city || !businessPhone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userShop = await Shop.findById({ _id: req.user.shop._id })
    .populate("owner")
    .select("-password");

  const existingSellerShop = await Shop.findOne(
    { shopName } || { businessPhone } || { businessEmail } || {
        ownerEmail,
      } || { owner } || {
        ownerPhone,
      }
  );

  if (existingSellerShop) {
    res
      .status(400)
      .json({ message: "shopName with  your informations already exists" });
  } else {
    if (!userShop) {
      //created
      res.status(400).json({ message: "Only owner is allower" });
    } else {
      // Handling banner and logo Images updating
      // Banner

      if (shopBanner !== "") {
        const ImgId = userShop?.shopBanner?.public_id;
        if (ImgId) {
          await cloudinary.uploader.destroy(ImgId);
        }
      }

      const newShopBanner = await cloudinary.uploader.upload(shopBanner, {
        folder: "images/banners",
        // width: 1000,
        // crop: "scale"
      });

      // Logo
      if (shopLogo !== "") {
        const ImgId = userShop?.shopLogo?.public_id;
        if (ImgId) {
          await cloudinary.uploader.destroy(ImgId);
        }
      }

      const newShopLogo = await cloudinary.uploader.upload(shopLogo, {
        folder: "images/banners",
        // width: 1000,
        // crop: "scale"
      });

      const updatedShop = await Shop.findByIdAndUpdate(
        { _id: userShop._id },
        {
          shopName,
          shopType,
          shopTypeName,
          address,
          city,
          businessPhone,

          shopLanguge: userShop.language,
          country: userShop.country,
          state: userShop.state,
          owner: userShop.owner._id,

          shopLogo: {
            public_id: newShopLogo.public_id,
            url: newShopLogo.secure_url,
          },
          shopBanner: {
            public_id: newShopBanner.public_id,
            url: newShopBanner.secure_url,
          },
        },

        { new: true }
      );
      if (updatedShop) {
        const shopUpdated = await Shop.findById({ _id: updatedShop._id });
        res.status(201).json({ shopUpdated, message: "Shop updated" });
      }
      res.status(400).json({ message: "Update error" });
    }
  }
};

// delete shop
exports.deleteSellerShop = async (req, res) => {
  // const { shopId } = req.params;
  // const shop = await Shop.findById({ _id: shopId });
  const userShop = await Shop.findById({ _id: req.user.shop._id });
  const shopProducts = await Product.find({ shop: userShop._id });

  if (!userShop) {
    res.status(400).json({ message: "Shop does not exist" });
  }

  if (!userShop) {
    res.status(400).json({ message: "Only the shop owner is allowed" });
  } else if (userShop && !shopProducts) {
    await Shop.findByIdAndDelete({ _id: userShop._id });
    res.status(201).json({ message: "Shop deleted " });
  } else if (userShop && shopProducts) {
    await Product.deleteMany({ shop: userShop._id });
    await Shop.findByIdAndDelete({ _id: userShop._id });
    res.status(201).json({ message: "Shop deleted and products " });
  } else {
    res.status(400).json({ message: "Permission denied" });
  }
};

// Suspend shop
exports.suspendSellerShop = async (req, res) => {
  const { shopId } = req.body;
  // const shop = await Shop.findById({ _id: shopId });
  const userShop = await Shop.findById({ _id: shopId });
  const shopProducts = await Product.find({ shop: userShop._id });

  if (!userShop) {
    res.status(400).json({ message: "Shop does not exist" });
  }

  if (!userShop) {
    res.status(400).json({ message: "Only the shop owner is allowed" });
  } else if (userShop && !shopProducts) {
    await Shop.findByIdAndUpdate(
      { _id: userShop._id },
      { shopStatus: "Suspended" }
    );
    res.status(201).json({ message: "Shop Suspended " });
  } else if (userShop && shopProducts) {
    await Shop.findByIdAndUpdate(
      { _id: userShop._id },
      { shopStatus: "Suspended" }
    );
    await Product.updateMany(
      { shop: userShop._id },
      { productStatus: "Suspended" }
    );
    res.status(201).json({ message: "Shop Suspended " });
  } else {
    res.status(400).json({ message: "Permission denied" });
  }
};

// Unsuspend user
exports.unSuspendSellerShop = async (req, res) => {
  const { shopId } = req.body;
  // const shop = await Shop.findById({ _id: shopId });
  const userShop = await Shop.findById({ _id: shopId }).populate("owner");
  const shopProducts = await Product.find({ shop: userShop._id }).populate(
    "shop"
  );
  const user = await User.findById({ _id: userShop.owner._id }).select(
    "-password"
  );

  if (!userShop) {
    res.status(400).json({ message: "Shop does not exist" });
  }

  if (!userShop) {
    res.status(400).json({ message: "Only the shop owner is allowed" });
  } else if (userShop && !shopProducts) {
    await Shop.findByIdAndUpdate(
      { _id: userShop._id },
      {
        shopStatus:
          user.status === "Suspended"
            ? "Suspended"
            : user.status === "Subscriber"
            ? "Subscriber"
            : user.status === "Premium"
            ? "Premium"
            : "active",
      }
    );
    res.status(201).json({ message: "Shop unsuspended " });
  } else if (userShop && shopProducts) {
    await Shop.findByIdAndUpdate(
      { _id: userShop._id },
      {
        shopStatus:
          user.status === "Suspended"
            ? "Suspended"
            : user.status === "Subscriber"
            ? "Subscriber"
            : user.status === "Premium"
            ? "Premium"
            : "active",
      }
    );
    await Product.updateMany(
      { shop: userShop._id },
      {
        productStatus:
          user.status === "Suspended"
            ? "Suspended"
            : user.status === "Subscriber"
            ? "Subscriber"
            : user.status === "Premium"
            ? "Premium"
            : "active",
      }
    );
    res.status(201).json({ message: "Shop unsuspended " });
  } else {
    res.status(400).json({ message: "Permission denied" });
  }
};

// get shops by contry
exports.getShopsByCountry = async (req, res) => {
  const { country } = req.body;
  const shops = await Shop.find({ country }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// get shops by state
exports.getShopsByState = async (req, res) => {
  const { state } = req.body;
  const shops = await Shop.find({ state }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// get shops by state
exports.getShopsByCity = async (req, res) => {
  const { city } = req.body;
  const shops = await Shop.find({ city }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// get shops by type
exports.getShopsByShopType = async (req, res) => {
  const { shopType } = req.body;
  const shops = await Shop.find({ shopType }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// get shops by type
exports.getShopsByShopType = async (req, res) => {
  const { shopType } = req.body;
  const shops = await Shop.find({ shopType }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// get shops by shopLanguge
exports.getShopsByShopLanguge = async (req, res) => {
  const { shopLanguge } = req.body;
  const shops = await Shop.find({ shopLanguge }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// get shops by shopStatus
exports.getShopsByShopStatus = async (req, res) => {
  const { shopStatus } = req.body;
  const shops = await Shop.find({ shopStatus }).populate("owner", "-password");

  if (!shops) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (shops) {
    res.status(201).json({ shops });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
