const MultiChat = require("../models/MultiChat");
const User = require("../models/User");
const Staff = require("../models/Staff");
const Shop = require("../models/Staff");

// on crée chat qui sera utilisé pour envoyer les message ou lancer les conversation entre user
exports.accessOrCreateChat = async (req, res) => {
  // pour créer un chat  l'id du user interlocutaire de créateur de chat
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User not found" });
  }
  if (req.user.role === "suspended") {
    return res.status(400).json({ message: "You are not Authorized" });
  }

  let isChat = await MultiChat.find({
    isGroupChat: false,
    chatStatus: "active",
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  // if (isChat.chatStatusOne === false || isChat.chatStatusTwo === false) {
  //   res.status(400).json({ message: "One of you has blocked this chat" });
  // }

  console.log("isChat:", isChat);

  if (isChat) {
    const blockedUser = isChat[0]?.blocked === req.user._id.toString();
    const blockerUser = isChat[0]?.blocker === req.user._id.toString();
    // if (isChat.blocker === req.user._id) {
    if (blockerUser) {
      res.status(400).json({ message: "You have blocked this person" });
    }
    // if (isChat.blocked === req.user._id) {
    if (blockedUser) {
      res.status(400).json({ message: "You are blocked" });
    }
  }

  //  on populate "sender" qui est une relation entre le model Chat-Message-User
  // ici on veut que chaque chat ait le nom, la photo et l'email des interlocutaires "sender"
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "first_name avatar email",
  });
  //   si le chat exist et qu'il a des interlocutaires, alores retourne le user connecté ou celui qui a lancé le chat
  //   on crée un chat seulemnt si le chat n'existe pas entre les deux utilisateurs
  if (isChat.length > 0) {
    res.status(200).json(isChat);
  } else {
    // si le chat n'existe pas on le crée
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await MultiChat.create(chatData);

    if (createdChat) {
      res.status(200).json({ message: "chat created" });
    } else {
      res
        .status(400)
        .json({ message: "Ooops! There is a error! chat not created" });
    }
  }
};

// BLOCK USER
exports.blockUser = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "Chat not found" });
  }

  if (req.user.role === "suspended") {
    return res.status(400).json({ message: "You are not Authorized" });
  }

  const blockedChat = await MultiChat.findOneAndUpdate(
    {
      _id: chatId,
      isGroupChat: false,
      chatStatus: "active",
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    },
    {
      blocker: req.user._id,
      blocked: userId,
    },
    { new: true }
  );
  res.status(201).json(blockedChat);
  // if (blockedChat) {
  //   res.status(201).json(blockedChat);
  // }
};
// UNBLOCK USER
exports.unBlockUser = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "Chat not found" });
  }

  if (req.user.role === "suspended") {
    return res.status(400).json({ message: "You are not Authorized" });
  }

  const myChat = await MultiChat.findOne({
    _id: chatId,
    isGroupChat: false,
    chatStatus: "active",
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });
  console.log("myChat:", myChat);

  if (myChat && myChat?.blocker === req.user._id.toString()) {
    const blockedChat = await MultiChat.findOneAndUpdate(
      {
        _id: chatId,
        isGroupChat: false,
        chatStatus: "active",
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      },
      {
        blocker: "",
        blocked: "",
      },
      { new: true }
    );
    res.status(201).json(blockedChat);
  }
  res.status(400).json({ message: "You can not unblock this chat" });
};

// STAFF CHAT
// on crée chat qui sera utilisé pour envoyer les message ou lancer les conversation entre user
exports.accessOrCreateStaffChat = async (req, res) => {
  // pour créer un chat  l'id du user interlocutaire de créateur de chat
  const { staffId } = req.body;

  if (
    req.user.isStaff !== true ||
    req.user.role === "fired" ||
    req.user.role === "suspended"
  ) {
    return res
      .status(400)
      .json({ message: "You are not Authorized (not staff member)" });
  }

  if (!staffId) {
    return res
      .status(400)
      .json({ message: "UserId param not sent with request" });
  }

  let isStaffChat = await MultiChat.find({
    isGroupChat: false,
    chatStatus: "active",
    isStaffChat: true,
    $and: [
      {
        staffMembers: {
          $elemMatch: { $eq: req.staff._id },
          // $elemMatch: { $eq: req.user._id && req.user.isStaff === true },
        },
      },
      { staffMembers: { $elemMatch: { $eq: staffId } } },
    ],
  })
    // .populate("staffMembers ")
    .populate({
      path: "staffMembers",
      populate: { path: "staff", select: "first_name avatar email" },
    })
    .populate("latestMessage");

  //  on populate "sender" qui est une relation entre le model Chat-Message-User
  // ici on veut que chaque chat ait le nom, la photo et l'email des interlocutaires "sender"
  isStaffChat = await Staff.populate(isStaffChat, {
    path: "latestMessage.staffSender",
    populate: { path: "staff", select: "first_name avatar email" },
    select: "first_name avatar email",
  });

  if (
    isStaffChat.chatStatusOne === false ||
    isStaffChat.chatStatusTwo === false
  ) {
    res.status(400).json({ message: "One of you has blocked this chat" });
  }
  // si le chat à plus d'un seul membre on l'affiche et si non on crée un nouveau chat
  if (isStaffChat.length > 0) {
    res.status(200).json(isStaffChat);
  } else {
    // si le chat n'existe pas on le crée
    var chatData = {
      chatName: "Staff-chat",
      isGroupChat: false,
      chatStatus: "active",
      isStaffChat: true,
      staffMembers: [req.staff._id, staffId],
    };

    const createdChat = await MultiChat.create(chatData);

    if (createdChat) {
      res.status(200).json({ message: "New staff chat  created !" });
    } else {
      res
        .status(400)
        .json({ message: "Ooops! There is a error! chat not created" });
    }
  }
};
// ************************************************************************************
// STAFF AND USERS CHAT
// on crée chat qui sera utilisé pour envoyer les message ou lancer les conversation entre user
exports.accessOrCreateMultiChat = async (req, res) => {
  // pour créer un chat  l'id du user interlocutaire de créateur de chat
  // const { userId, staffId } = req.body;
  const { userId } = req.body;
  const user = await User.findById({ _id: req.user._id });

  // if (!userId || !staffId) {
  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId and staffId param not sent with request" });
  }
  if (user.role === "suspended") {
    return res.status(400).json({ message: "You are not Authorized" });
  }

  let isMultiChat = await MultiChat.find({
    isGroupChat: false,
    chatStatus: "active",
    isSMultiChat: true,
    $and: [
      {
        staffAndUsers: {
          $elemMatch: { $eq: req.user._id },
          // $elemMatch: { $eq: req.user._id && req.user.isStaff === true },
        },
      },
      { staffAndUsers: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate({
      path: "staffAndUsers",
      // populate: { path: "staff", select: "-password" },
      select: "-password",
    })
    .populate("latestMessage");

  //  on populate "sender" qui est une relation entre le model Chat-Message-User
  // ici on veut que chaque chat ait le nom, la photo et l'email des interlocutaires "sender"
  isMultiChat = await User.populate(isMultiChat, {
    path: "latestMessage.sender",
    // populate: { path: "staff", select: "first_name avatar email -password " },
    select: "first_name avatar email",
  });
  isMultiChat = await Staff.populate(isMultiChat, {
    path: "latestMessage.staffSender",
    populate: { path: "staff", select: "first_name avatar email -password " },
    select: "first_name avatar email",
  });

  if (
    isMultiChat.chatStatusOne === false ||
    isMultiChat.chatStatusTwo === false
  ) {
    res.status(400).json({ message: "One of you has blocked this chat" });
  }
  // si le chat à plus d'un seul membre on l'affiche et si non on crée un nouveau chat
  if (isMultiChat.length > 0) {
    res.status(200).json(isMultiChat);
  } else {
    // si le chat n'existe pas on le crée
    var chatData = {
      chatName: "Staff-user-chat",
      isGroupChat: false,
      chatStatus: "active",
      isSMultiChat: true,
      staffAndUsers: [req.user._id, userId],
      // staffAndUsers: [req.staff._id, userId || staffId],
    };
    if (user.isStaff === true) {
      const createdChat = await MultiChat.create(chatData);
      if (createdChat) {
        res.status(200).json({ message: "New staff-user chat  created !" });
      } else {
        res.status(400).json({
          message: "Ooops! There is a error! staff and user chat not created",
        });
      }
    }
    res.status(400).json({ message: "Only staff can create this chat" });
  }
};

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// get user's chats
exports.getUserChats = async (req, res) => {
  if (req.user.role === "suspended") {
    return res.status(400).json({ message: "You are not Authorized" });
  }

  try {
    MultiChat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("staffMembers")
      .populate("staffAndUsers", "-password")
      .populate("shopOwners")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "first_name last_name avatar email",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ooops! There is a error! chats not fetched" });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// get staff chats
exports.getStaffChats = async (req, res) => {
  if (
    req.user.isStaff !== true ||
    req.user.role === "fired" ||
    req.user.role === "suspended"
  ) {
    return res
      .status(400)
      .json({ message: "You are not Authorized (not staff member)" });
  }

  const allowedStaff = await Staff.findOne({
    staff: req.user._id,
    status: "active",
  });

  if (allowedStaff) {
    MultiChat.find({
      staffMembers: { $elemMatch: { $eq: allowedStaff._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "staffMembers",
        populate: {
          path: "staff",
          select: "first_name last_name avatar email",
        },
      })
      .populate("staffAndUsers", "-password")
      .populate("shopOwners")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await Staff.populate(results, {
          path: "latestMessage.staffSender",
          // select: "staff",
          populate: {
            path: "staff",
            select: "first_name last_name avatar email",
          },
        });

        res.status(200).json(results);
      });
  } else {
    res.status(400).json({ message: "You are not allowed" });
  }
};
// // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// // get staff and chats
exports.getStaffAndUserChats = async (req, res) => {
  if (
    req.user.isStaff !== true ||
    req.user.role === "fired" ||
    req.user.role === "suspended"
  ) {
    return res
      .status(400)
      .json({ message: "You are not Authorized (not staff member)" });
  }

  const allowedStaff = await Staff.findOne({
    staff: req.user._id,
    status: "active",
  });

  MultiChat.find({
    staffAndUsers: { $elemMatch: { $eq: allowedStaff?.staff || req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("staffMembers")
    .populate("staffAndUsers", "-password")
    .populate("shopOwners")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.staffSender",
        // select: "staff",
        populate: {
          path: "staff",
          select: "first_name last_name avatar email",
        },
      });
      if (results) {
        res.status(200).json(results);
      } else {
        res.status(400).json({ message: "No chats found" });
      }
    });

  // console.log("req.staff.staff:", req?.staff?.staff);
};

// create a groupe chat

exports.createGroupChat = async (req, res) => {
  const { groupMembers, ChatGroupname } = req.body;

  if (!groupMembers || !ChatGroupname) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }
  if (req.user.role === "suspended") {
    return res.status(400).json({ message: "You are not Authorized" });
  }

  if (groupMembers.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }
  //  req.user: ici c'est l'admin qui veut créer le group
  groupMembers.push(req.user);

  try {
    const groupChat = await MultiChat.create({
      chatName: ChatGroupname,
      users: groupMembers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await MultiChat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ooops! there is an error! check create group chat" });
  }
};
// create a staff groupe chat

exports.createStaffGroupChat = async (req, res) => {
  const { staffMembers, ChatGroupname } = req.body;

  if (!staffMembers || !ChatGroupname) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }

  if (
    req.user.isStaff !== true ||
    req.user.role === "fired" ||
    req.user.role === "suspended"
  ) {
    return res
      .status(400)
      .json({ message: "You are not Authorized (not staff member)" });
  }
  const staffMember = await Staff.findOne({
    staff: req.user._id,
    status: "active",
  });

  if (!staffMember) {
    res.status(400).json({ message: "You are not Allowed" });
  }
  if (staffMembers.length < 2) {
    const staffGroupMember1 = await Staff.findOne({ staff: staffMembers[0] });
    const staffGroupMember2 = await Staff.findOne({ staff: staffMembers[1] });
    if (!staffGroupMember1 || !staffGroupMember2) {
      return res.status(400).json({
        message: "Please select staff members to create staff group chat",
      });
    }
  }
  //  req.staff: ici c'est l'admin qui veut créer le group

  // console.log("req.staff:", req.staff);

  staffMembers.push(staffMember);

  console.log("req.staff:", req.staff);

  const groupChat = await MultiChat.create({
    chatName: ChatGroupname,
    staffMembers: staffMembers,
    isGroupChat: true,
    staffGroupAdmin: staffMember._id,
  });

  const fullGroupChat = await MultiChat.findOne({ _id: groupChat._id })
    .populate({
      path: "staffMembers",
      populate: {
        path: "staff",
        select: "first_name last_name profileImage email",
      },
    })
    .populate({
      path: "staffGroupAdmin",
      populate: {
        path: "staff",
        select: "first_name last_name profileImage email",
      },
    });

  res.status(200).json(fullGroupChat);
};

// create a multichat groupe for all users

exports.createMultiGroupChat = async (req, res) => {
  const { ChatGroupname } = req.body;

  if (!ChatGroupname) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }
  if (
    req.user.isStaff !== true ||
    req.user.role === "fired" ||
    req.user.role === "suspended"
  ) {
    return res
      .status(400)
      .json({ message: "You are not Authorized (not staff member)" });
  }
  const multichatAdminGroup = await User.findOne({
    _id: req.user._id,
    isStaff: req.user.isStaff === true,
  });
  const users = await User.find();
  console.log("users:", users);
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }
  //  req.user: ici c'est l'admin qui veut créer le group
  // groupMembers.push(multichatAdminGroup, users);

  try {
    const groupChat = await MultiChat.create({
      chatName: ChatGroupname,
      users: users,
      isGroupChat: true,
      groupAdmin: multichatAdminGroup._id,
    });

    const fullGroupChat = await MultiChat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ooops! there is an error! check create group chat" });
  }
};
// create a multichat groupe for staff  and selected users

exports.createMultiGroupChatForSelectedUsers = async (req, res) => {
  const { groupMembers, ChatGroupname } = req.body;

  if (!groupMembers || !ChatGroupname) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }
  if (
    req.user.isStaff !== true ||
    req.user.role === "fired" ||
    req.user.role === "suspended"
  ) {
    return res
      .status(400)
      .json({ message: "You are not Authorized (not staff member)" });
  }
  const multichatAdminGroup = await User.findOne({
    _id: req.user._id,
    isStaff: req.user.isStaff === true,
  });
  // const users = await User.find({
  //   _id: req.user._id,
  //   role: req.user.role !== "suspended",
  // });

  if (groupMembers.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }
  //  req.user: ici c'est l'admin qui veut créer le group
  // groupMembers.push(multichatAdminGroup, users);
  groupMembers.push(multichatAdminGroup);

  try {
    const groupChat = await MultiChat.create({
      chatName: ChatGroupname,
      users: groupMembers,
      isGroupChat: true,
      groupAdmin: multichatAdminGroup._id,
    });

    const fullGroupChat = await MultiChat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ooops! there is an error! check create group chat" });
  }
};
// Update groups chats

// exports.updateGroupShop = async (req, res) => {
//   if (shopBanner !== "") {
//     const ImgId = userShop?.shopBanner?.public_id;
//     if (ImgId) {
//       await cloudinary.uploader.destroy(ImgId);
//     }
//   }

//   const newShopBanner = await cloudinary.uploader.upload(shopBanner, {
//     folder: "images/banners",
//     // width: 1000,
//     // crop: "scale"
//   });

//   // Logo
//   if (shopLogo !== "") {
//     const ImgId = userShop?.shopLogo?.public_id;
//     if (ImgId) {
//       await cloudinary.uploader.destroy(ImgId);
//     }
//   }

//   const newShopLogo = await cloudinary.uploader.upload(shopLogo, {
//     folder: "images/banners",
//     // width: 1000,
//     // crop: "scale"
//   });

// }
