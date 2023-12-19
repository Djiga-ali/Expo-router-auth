const User = require("../models/User");
const Shop = require("../models/Shop");
const Product = require("../models/Product");
const Order = require("../models/Order");
const slugify = require("slugify");
const Customer = require("../models/Customer");

exports.createNewOrder = async (req, res) => {
  const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
  const buyer = await User.findById({ _id: req.user._id });
  // on recupère tous les shops qui ont de produits dans le cart
  const allShopIdsInCart = cart && cart?.map((item) => item?.shop?._id);

  // keep only unique or one id of every shop (no duplication)
  const removeDiplicate = (data) => {
    return data.filter((value, index) => data.indexOf(value) === index);
  };
  // console.log("uniqueIds:", removeDiplicate(allShopIdsInCart));

  const uniqueShopId = removeDiplicate(allShopIdsInCart);

  const shopItemMap = new Map();
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for...of
  for (const shopId of uniqueShopId) {
    const shopItems = cart && cart?.filter((item) => item.shop._id === shopId);
    // console.log("shopItems:", shopItems);

    if (!shopItemMap.has(shopId)) {
      shopItemMap.set(shopId, []);
    }
    shopItemMap.get(shopId).push(shopItems);
  }

  // to create shop customer
  const allShopInCart = cart && cart?.map((item) => item?.shop);

  const uniqueShop = allShopInCart.reduce((accumulator, current) => {
    if (!accumulator.find((shop) => shop._id === current._id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  // to create shop customer

  const orders = [];
  for (const [shopId, shopItems] of shopItemMap) {
    const order = await Order.create({
      cart: shopItems,
      shippingAddress,
      user: buyer._id,
      totalPrice,
      paymentInfo,
    });
    if (order) {
      orders.push(order);
    }
  }

  if (orders.length) {
    const customer = await Customer.create({
      customer: buyer._id,
      shop: uniqueShop,
      orders: orders,
    });
    res.status(201).json({ orders, customer });
  }
  res.status(400).json({ message: "No order created" });
};

exports.uniqueStripeAccountIdTest = async (req, res) => {
  const { cart } = req.body;
  // const buyer = await User.findById({ _id: req.user._id });
  // on recupère tous les shops qui ont de produits dans le cart
  const allShopIdsInCart = cart && cart?.map((item) => item?.shop?._id);

  // keep only unique or one id of every shop (no duplication)
  const removeDiplicate = (data) => {
    return data.filter((value, index) => data.indexOf(value) === index);
  };
  // console.log("uniqueIds:", removeDiplicate(allShopIdsInCart));

  const uniqueShopId = removeDiplicate(allShopIdsInCart);

  const shopItemMap = new Map();
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for...of
  for (const shopId of uniqueShopId) {
    const shopItems = cart && cart?.filter((item) => item.shop._id === shopId);
    // console.log("shopItems:", shopItems);

    if (!shopItemMap.has(shopId)) {
      shopItemMap.set(shopId, []);
    }
    shopItemMap.get(shopId).push(shopItems);
  }

  // to create shop customer
  const allShopInCart = cart && cart?.map((item) => item?.shop);

  const uniqueShop = allShopInCart.reduce((accumulator, current) => {
    if (!accumulator.find((shop) => shop._id === current._id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  const uniqueStripeAccountId = allShopInCart.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (shop) => shop.stripe_account_id === current.stripe_account_id
      )
    ) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);

  res.status(200).json(uniqueStripeAccountId);
};
