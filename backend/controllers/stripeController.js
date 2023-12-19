const User = require("../models/User");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const Order = require("../models/Order");
const slugify = require("slugify");
const Customer = require("../models/Customer");

const ObjectId = require("mongodb");

// const queryString = require("query-string");
const querystring = require("node:querystring");
// Setup stripe
const Stripe = require("stripe");
const { default: mongoose } = require("mongoose");
const stripe = Stripe(process.env.STRIPE_SECRET);
// ou
// https://stripe.com/docs/connect/express-accounts
// const stripe = require('stripe')(process.env.STRIPE_SECRET)

// On permet à seller de créer un compte connecté stripe
exports.createConnectAccount = async (req, res) => {
  // 1. find user from db
  const shop = await Shop.findOne({ owner: req.user._id }).exec();
  // console.log("USER: ", req.user);
  // 2. if user don't have stripe_account_id yet, create now
  // on crée un compte connetcé pour le seller puis on enregistre l'id du compte car à chauqe requete un nouvel id est générer par stripe. et nous ne veut pas ça????
  if (!shop.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
    });
    console.log("ACCOUNT ===> ", account);

    shop.stripe_account_id = account.id;
    shop.save();
  }

  // 3. create login link based on account id (for frontend to complete onboarding)
  // use "let"  and not "const"
  let accountLink = await stripe.accountLinks.create({
    account: shop.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });
  // prefill any info such as email

  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": shop.email || undefined,
  });

  // console.log("ACCOUNT LINK", accountLink);

  let link = `${accountLink.url}?${querystring.stringify(accountLink)}`;
  // console.log("LOGIN LINK", link);
  res.status(201).json(link);
  // // 4. update payment schedule (optional. default is 2 days
};

// Get Status pour le callback url
// on crée un fonction, qui sera utilisé dans  pour change le delais par defaut de 2 jours à 7 jours pour le transfert automatique  d'argent aux vendeurs
const updateDelayDays = async (accountId) => {
  const account = await stripe.accounts.update(accountId, {
    settings: {
      payouts: {
        schedule: {
          delay_days: 7,
        },
      },
    },
  });
  return account;
};

exports.getAccountStatus = async (req, res) => {
  // console.log("GET ACCOUNT STATUS");
  const shop = await Shop.findOne({ owner: req.user._id }).exec();
  const account = await stripe.accounts.retrieve(shop.stripe_account_id);
  // console.log("USER ACCOUNT RETRIEVE", account);
  // update delay days
  const updatedAccount = await updateDelayDays(account.id);
  const updatedShop = await Shop.findByIdAndUpdate(
    { _id: shop._id },
    {
      // stripe_seller: account, //(étape 1)
      stripe_seller: updatedAccount, //(étape 1 et 2)
    },
    { new: true }
  )
    .select("-password")
    .exec();
  // console.log(updatedUser);
  res.json(updatedShop);
};

// Get balance
exports.getAccountBalance = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id }).exec();

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: shop.stripe_account_id,
    });
    // console.log("BALANCE ===>", balance);
    res.status(200).json(balance);
  } catch (err) {
    console.log(err);
  }
};
// We create a login link for seller account settings:
exports.payoutSetting = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id }).exec();

    const loginLink = await stripe.accounts.createLoginLink(
      shop.stripe_account_id,
      {
        redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL,
      }
    );
    // console.log("LOGIN LINK FOR PAYOUT SETTING", loginLink);
    res.json(loginLink);
  } catch (err) {
    console.log("STRIPE PAYOUT SETTING ERR ", err);
  }
};

// Create checkout sessions for sellers :::
exports.stripeSessionId = async (req, res) => {};

//
exports.stripeSuccess = async (req, res) => {
  try {
    // 1 get hotel id from req.body
    const { hotelId } = req.body;
    // 2 find currently logged in user
    const user = await User.findById(req.user._id).exec();
    // check if user has stripeSession
    if (!user.stripeSession) return;
    // 3 retrieve stripe session, based on session id we previously save in user db
    const session = await stripe.checkout.sessions.retrieve(
      user.stripeSession.id
    );
    // 4 if session payment status is paid, create order
    if (session.payment_status === "paid") {
      // 5 check if order with that session id already exist by querying orders collection
      const orderExist = await Order.findOne({
        "session.id": session.id,
      }).exec();
      if (orderExist) {
        // 6 if order exist, send success true
        res.json({ success: true });
      } else {
        // 7 else create new order and send success true
        let newOrder = await Order.create({
          hotel: hotelId,
          session,
          orderedBy: user._id,
        });
        // 8 remove user's stripeSession
        await User.findByIdAndUpdate(user._id, {
          $set: { stripeSession: {} },
        });
        res.json({ success: true });
      }
    }
  } catch (err) {
    console.log("STRIPE SUCCESS ERR", err);
  }
};

// // Create Payment intents   :::
exports.createPaymentIntent = async (req, res) => {
  const { order, totalAmount } = req.body;
  // console.log("order:", order);
  // console.log("totalAmount:", totalAmount);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // à mettre le motant dans
    currency: "usd",
    // transfer_group: 'ORDER10',
    // source_transaction: "ORDER10",
  });
  // console.log("paymentIntent.client_secret:", paymentIntent.client_secret);

  res.status(200).json(paymentIntent.client_secret);
  // res.status(200).json(paymentIntent);
};

// // retreive data for payement itentent and transfer money to sellers  :::::::::::::::::::::::::::::::::
exports.transferMoneyToSellers = async (req, res) => {
  const { order, paymentStatus, paymentIntent } = req.body;
  const buyer = await User.findById({ _id: req.user._id });
  // console.log("paymentStatus:", paymentStatus);
  // console.log("order:", order);

  // Etape :1

  const intent = await stripe.paymentIntents.retrieve(paymentIntent);

  // console.log("intent.latest_charge:", intent.latest_charge);
  // const charges = intent;
  let shopInCart = [];
  let shopAccountIds = [];

  const shopAccountId = order && order?.filter((item) => item.shopAccountId);
  // console.log("shopAccountId:", shopAccountId);
  // console.log("shopAccountIds:", shopAccountIds);

  const cartData = order && order;

  const transferData = [];
  const orderData = [];
  for (const item of cartData) {
    const shop = await Shop.findOne({ stripe_account_id: item.shopAccountId });
    // console.log("shop:",shop);

    if (intent.latest_charge) {
      const transfer = await stripe.transfers.create({
        amount: (item.totalByShop * 100 * 80) / 100,
        currency: "eur",
        destination: item.shopAccountId,
        // transfer_group: 'ORDER_95',
        source_transaction: intent.latest_charge,
      });

      if (transfer) {
        const customerOrder = await Order.create({
          cart: item.shopItems,
          customer: buyer._id,
          shippingAddress: "3 av 41",
          totalPrice: item.totalByShop,
          transfer: transfer,
          shop: shop,
          paymentIntent: intent,
          stripeTotalTransferedAmount: (item.totalByShop * 100 * 80) / 100,
        });
        orderData.push(customerOrder);
      }
      console.log("transfer:", transfer);
      transferData.push(transfer);
    }
  }

  // to create shop customer
  const allShopInOrder =
    order && order?.map((o) => o.shopItems?.map((item) => item?.item.shop));

  let customer;
  if (order) {
    customer = await Customer.create({
      customer: buyer._id,
      shop: allShopInOrder,
      orders: orderData,
    });
  }

  res.status(200).json({ intent, transferData, customer, orderData });
};

// ANNULATION PAR L'ADMIN OU SELLER
exports.cancelTransferFromAdmin = async (req, res) => {
  const { orderId, amount } = req.body;
  const orderTransferToCancel = await Order.findById({ _id: orderId });

  if (orderTransferToCancel) {
    const transferReversal = await stripe.transfers.createReversal(
      orderTransferToCancel.transfer.id,
      {
        // amount:  orderTransferToCancel.transfer.amount,
        amount: amount * 100,
      }
    );
    const canceledTransfer = await Order.findByIdAndUpdate(
      { _id: orderTransferToCancel._id },
      { status: "canceled" },
      { new: true }
    );
    res.status(200).json(canceledTransfer);
  } else {
    res.status(400).json({ message: "no order related to that transfer" });
  }
};

// ANNULATION PAR LE CUSTOMER

exports.cancelOrderFromCustomer = async (req, res) => {
  const {
    orderId,
    stripeTotalTransferedAmount,
    customerId,
    itemId,
    itemQty,
    itemPrice,
  } = req.body;
  if (!orderId)
    if (itemId) {
      const cancelSingleItemInOrder = await Order.updateOne(
        {
          _id: orderId,
        },
        { $pull: { cart: { itemId: itemId } } }
      );
    }

  if (stripeTotalTransferedAmount || itemPrice) {
    const transferReversal = await stripe.transfers.createReversal(
      orderToCancel.transfer.id,
      {
        amount: stripeTotalTransferedAmount || itemPrice,
        // amount: amount * 100,
      }
    );
    if (itemPrice) {
      const canceledTransfer = await Order.findByIdAndUpdate(
        { _id: orderToCancel._id },
        { status: "Partial-canceled" },
        { new: true }
      );
      const product = await Product.findByIdAndUpdate(
        { _id: itemId },
        {
          quantity: quantity + itemQty,
        },
        { new: true }
      );
    } else {
      const canceledTransfer = await Order.findByIdAndUpdate(
        { _id: orderToCancel._id },
        { status: "canceled" },
        { new: true }
      );
    }

    if (itemId) {
      const product = await Product.findByIdAndUpdate({ _id: itemId }, {}, {});
    }
    res.status(200).json(canceledTransfer);
  } else {
    res.status(400).json({ message: "no order related to that transfer" });
  }
};

// NB: REMBOURSEMENT
// partial Refound
exports.partialRefound = async (req, res) => {
  const {
    orderId,
    stripeTotalTransferedAmount,
    customerId,
    productId,
    itemPrice,
  } = req.body;
  const canceledItemPrice = (itemPrice * 20) / 100;
  // const orderToCancel
  //
  const refund = await stripe.refunds.create({
    charge: "{{CHARGE_ID}}",
  });
};

// total Refound
exports.totalRefound = async (req, res) => {
  const {
    orderId,
    stripeTotalTransferedAmount,
    customerId,
    productId,
    itemPrice,
  } = req.body;
  const canceledItemPrice = (itemPrice * 20) / 100;
  // const orderToCancel
  //
  const refund = await stripe.refunds.create({
    charge: "{{CHARGE_ID}}",
    amount: 1000,
  });
};

exports.testHandleOrderArray = async (req, res) => {
  const {
    orderId,
    itemId,
    stripeTotalTransferedAmount,
    customerId,
    productId,
    itemPrice,
  } = req.body;

  const order = await Order.findById({ _id: orderId });

  // const orderToCancel = await Order.updateOne(
  //   {
  //     _id: orderId,
  //   },
  //   { $pull: { cart: { price: 123, itemQty: 2 } } }
  // );
  // if (orderId) {
  const setCanceledItem = await Order.updateOne(
    {
      _id: orderId,
    },
    { $set: { canceledItem: itemId } },
    { upsert: true }
  );

  // Update many ok
  // const setCanceledItem = await Product.updateMany(
  //   {},
  //   { $set: { quantity: 10 } },
  //   { upsert: true }
  // );

  res.status(200).json(setCanceledItem);
  // }
};

exports.changeItemQty = async (req, res) => {
  const { order } = req.body;
  let shopInCart = [];
  let allIds = [];

  const cartData = order && order;
  // console.log("order:", order);

  // const ids = order && order.filter((i) => i.shopItems);

  const transferData = [];
  const orderData = [];
  for (const item of order) {
    const ids = item.itemIds;
    const product = await Product.find({ _id: ids });
    // const myIds = ids.map((i) => i.map((p) => p));
    console.log("product:", product);

    allIds.push(item);
  }

  res.status(200).json({ allIds, order });
};
