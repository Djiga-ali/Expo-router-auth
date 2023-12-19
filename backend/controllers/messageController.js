const MultiChat = require("../models/MultiChat");
const User = require("../models/User");
const Message = require("../models/Message");
const cloudinary = require("../config/cloudinary");
const Shop = require("../models/Shop");
const Staff = require("../models/Staff");

// User Messages :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
exports.sendMessage = async (req, res) => {
  const { content, chatId, to, object, attached } = req.body;

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.status(400).json({ message: "content and chatId are required" });
  }

  const currentChat = await MultiChat.findById({ _id: chatId }).populate(
    "users"
  );
  const receiver = currentChat?.users?.filter(function (value, index, arr) {
    // console.log("value:", value._id);
    // console.log(" req.user._id:", req.user._id);
    return value._id.toString() !== req.user._id.toString();
  });

  let newMessage = {
    sender: req.user._id,
    receiver: receiver[0]?.first_name + " " + receiver[0]?.last_name,
    content: content,
    chat: chatId,
    object: "I'm interrested to this product",
    // attached: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "first_name last_name avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "first_name last_name profileImage email",
    });

    await MultiChat.findByIdAndUpdate(
      { _id: chatId },
      { latestMessage: message }
    );

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: "There is an error! message not sent" });
  }
};

exports.getUserMessages = async (req, res) => {
  // on recupère tous les msg de chaque chat
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "first_name last_name profileImage email") //on populate le sender et on selection les doc qu'on veut "name, pic, email"
    .populate("chat");
  res.status(200).json(messages);
};

// Staff message :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
exports.staffMessage = async (req, res) => {
  const { content, chatId, to, object, attached } = req.body;

  const allowedStaff = await Staff.findOne({
    staff: req.user._id,
    status: "active",
  });

  if (!req.staff) {
    return res
      .status(400)
      .json({ message: "You can't send message to this chat" });
  }

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.status(400).json({ message: "content and chatId are required" });
  }

  if (allowedStaff) {
    const currentChat = await MultiChat.findById({ _id: chatId }).populate({
      path: "staffMembers",
      populate: { path: "staff", select: "-password" },
    });
    const receiver = currentChat?.staffMembers?.filter(function (
      value,
      index,
      arr
    ) {
      return value._id.toString() !== req.staff._id.toString();
    });

    //   const result = await cloudinary.uploader.upload(attached, {
    //     folder: "images/attached",
    //     // width: 300,
    //     // crop: "scale"
    //   });

    let newMessage = {
      staffSender: req.staff._id,
      receiver:
        receiver[0]?.staff?.first_name + " " + receiver[0]?.staff?.last_name,
      content: content,
      chat: chatId,
      object,
      // attached: {
      //   public_id: result.public_id,
      //   url: result.secure_url,
      // },
    };

    try {
      let message = await Message.create(newMessage);

      message = await message.populate("sender", "first_name last_name avatar");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "first_name last_name avatar email",
      });

      await MultiChat.findByIdAndUpdate(
        { _id: chatId },
        { latestMessage: message }
      );

      res.status(200).json(message);
    } catch (error) {
      res.status(400).json({ message: "There is an error! message not sent" });
    }
  }
  return res.status(400).json({ message: "You  are not allowed" });
};
// Multi chat :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
exports.multiChatMessage = async (req, res) => {
  const { content, chatId, to, object, attached } = req.body;

  const allowedStaff = await Staff.findOne({
    staff: req.user._id,
    status: "active",
  });

  if (req.user.isStaff === false || !allowedStaff) {
    return res
      .status(400)
      .json({ message: "You can't send message to this chat" });
  }

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.status(400).json({ message: "content and chatId are required" });
  }

  const currentChat = await MultiChat.findById({ _id: chatId }).populate({
    path: "staffAndUsers",
    // populate: { path: "staff", select: "-password" },
  });
  const receiver = currentChat?.staffAndUsers?.filter(function (
    value,
    index,
    arr
  ) {
    // return value._id.toString() !== req.user._id.toString();
    return value.isStaff === false;
  });

  let newMessage = {
    staffSender: req.user._id,
    receiver: receiver[0]?.first_name + " " + receiver[0]?.last_name,
    content: content,
    chat: chatId,
    object,
    // attached: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "first_name last_name avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "first_name last_name avatar email",
    });

    await MultiChat.findByIdAndUpdate(
      { _id: chatId },
      { latestMessage: message }
    );

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: "There is an error! message not sent" });
  }
};

// ??? Shop Messages :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
exports.shopAndUserMessage = async (req, res) => {
  const { content, chatId, to, object, attached } = req.body;

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.status(400).json({ message: "content and chatId are required" });
  }

  const shop = await Shop.findOne({ owner: req.user.shop.owner }).populate(
    "owner"
  );

  const currentChat = await MultiChat.findById({ _id: chatId }).populate(
    "users"
  );
  const receiver = currentChat?.users?.filter(function (value, index, arr) {
    console.log("value:", value._id);
    // console.log(" req.user._id:", req.user._id);
    // console.log(" shop.owner._id:", shop.owner._id);
    return (
      value._id.toString() !== req.user._id.toString() ||
      value._id.toString() !== shop.owner._id.toString()
    );
  });

  console.log("receiver:", receiver);

  //   const result = await cloudinary.uploader.upload(attached, {
  //     folder: "images/attached",
  //     // width: 300,
  //     // crop: "scale"
  //   });

  let newMessage = {
    sender: shop.owner._id ? shop.owner._id : req.user._id,
    receiver: receiver[0]?.first_name + " " + receiver[0]?.last_name,
    content: content,
    chat: chatId,
    object: "I'm interrested to this product",
    // attached: {
    //   public_id: result.public_id,
    //   url: result.secure_url,
    // },
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "first_name last_name avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "first_name last_name avatar email",
    });

    await MultiChat.findByIdAndUpdate(
      { _id: chatId },
      { latestMessage: message }
    );

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: "There is an error! message not sent" });
  }
};
