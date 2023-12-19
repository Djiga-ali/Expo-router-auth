require("dotenv").config();
require("express-async-errors"); //recommander et remplace "express-async-handler   "
const express = require("express");
const app = express();
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
// const corsConfig = require("./config/corsConfig");
const corsOptions = require("./config/corsOptions");
const connectToDB = require("./config/dbConfig");
// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const shopRoutes = require("./routes/shopRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const chatRoutes = require("./routes/chatRoutes");
const staffRoutes = require("./routes/staffRoutes");
const multiChatRoutes = require("./routes/multiChatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const eventRoutes = require("./routes/eventRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

const PORT = process.env.PORT || 7000;

connectToDB();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/shop", shopRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/chat", chatRoutes);
app.use("/staff", staffRoutes);
app.use("/multi-chat", multiChatRoutes);
app.use("/message", messageRoutes);
app.use("/order", orderRoutes);
app.use("/hotel", hotelRoutes);
app.use("/event", eventRoutes);
app.use("/stripe", stripeRoutes);

app.use(notFound);
app.use(errorHandler);

// Socket.io
const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}`));

// on connect le backend to front
const io = require("socket.io")(server, {
  pingTimeout: 60000, // pingTimeout: le moment que le socket restera inactive avant de se fermer automatiquement
  cors: corsOptions,
  // cors: {
  //   origin: corsOptions,
  //   // credentials: true,
  //   optionsSuccessStatus: 200,
  // },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
});
