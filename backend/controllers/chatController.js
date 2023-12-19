const Chat = require("../models/Chat");
const User = require("../models/User");

// on crée chat qui sera utilisé pour envoyer les message ou lancer les conversation entre user
exports.accessOrCreateNewChat = async (req, res) => {
  // pour créer un chat  l'id du user interlocutaire de créateur de chat
  const { userId } = req.body;

  // mais avant de créer un chat onvérifie s'il y a bien un interlocutaire
  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId param not sent with request" });
  }

  //   on définit notre chat: ici le chat privé doit avoir au moins deux interlocutaires:
  let isChat = await Chat.find({
    isGroupChat: false,
    chatStatusOne: true,
    chatStatusTwo: true,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //  on populate "sender" qui est une relation entre le model Chat-Message-User
  // ici on veut que chaque chat ait le nom, la photo et l'email des interlocutaires "sender"
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "first_name avatar email",
  });

  //   si le chat exist et qu'il des interlocutaires, alores retourne le user connecté ou celui qui a lancé le chat
  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    // si le chat n'existe pas on le crée
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      chatStatusOne: true,
      chatStatusTwo: true,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const MyChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      if (MyChat.chatStatusOne === false || MyChat.chatStatusTwo === false) {
        res.status(400).json({ message: "One of you has blocked this chat" });
      }
      res.status(200).json(MyChat);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Ooops! There is a error! chat not created" });
    }
  }
};

// Get all user's chats

exports.getUserChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
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

// create a groupe chat
exports.createGroupChat = async (req, res) => {
  const { groupMembers, ChatGroupname } = req.body;

  if (!groupMembers || !ChatGroupname) {
    return res.status(400).json({ message: "Please Fill all the feilds" });
  }

  if (groupMembers.length < 2) {
    return res
      .status(400)
      .json({ message: "More than 2 users are required to form a group chat" });
  }
  //  req.user: ici c'est l'admin qui veut créer le group
  groupMembers.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: ChatGroupname,
      users: groupMembers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ooops! there is an error! check create group chat" });
  }
};

// Rename the group chat
exports.renameChatGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
};

// Remove member from a group
exports.removeUserFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const groupMembersAfterRemove = await Chat.findByIdAndUpdate(
    chatId,
    {
      // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!groupMembersAfterRemove) {
    res.status(404).json({ message: "Chat Not Found" });
  } else {
    res.status(200).json(groupMembersAfterRemove);
  }
};

// Add user to chat group
exports.addUserToChatGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin
  const existingUser = await Chat.findOne({
    users: userId,
  });
  if (existingUser) {
    res.status(400).json({ message: "User already exist" });
  }

  const goupeWithAddedMember = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!goupeWithAddedMember) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(goupeWithAddedMember);
  }
};

// Block User
exports.blockUserOne = async (req, res) => {
  const { chatId } = req.body;

  // check if the requester is admin
  const user = await User.findById({ _id: req.user._id });
  await Chat.findByIdAndUpdate(
    chatId,
    {
      chatStatusOne: false,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!user) {
    res.status(404).json({ message: "Please Login" });
  } else {
    res.status(201).json({ message: "User Blocked" });
  }
};

// Block User
exports.blockUserTwo = async (req, res) => {
  const { chatId } = req.body;

  // check if the requester is admin
  const user = await User.findById({ _id: req.user._id });
  await Chat.findByIdAndUpdate(
    chatId,
    {
      chatStatusTwo: false,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!user) {
    res.status(404).json({ message: "Please Login" });
  } else {
    res.status(201).json({ message: "User Blocked" });
  }
};
// Unblock User
exports.unBlockUserOne = async (req, res) => {
  const { chatId } = req.body;

  // check if the requester is admin
  const user = await User.findById({ _id: req.user._id });
  await Chat.findByIdAndUpdate(
    chatId,
    {
      chatStatusOne: true,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!user) {
    res.status(404).json({ message: "Please Login" });
  } else {
    res.status(201).json({ message: "User unblocked" });
  }
};
// Unblock User
exports.unBlockUserTwo = async (req, res) => {
  const { chatId } = req.body;

  // check if the requester is admin
  const user = await User.findById({ _id: req.user._id });
  await Chat.findByIdAndUpdate(
    chatId,
    {
      chatStatusTwo: true,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!user) {
    res.status(404).json({ message: "Please Login" });
  } else {
    res.status(201).json({ message: "User unblocked" });
  }
};
