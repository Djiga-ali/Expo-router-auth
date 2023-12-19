const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    mongoose.connection.once("open", () => {
      console.log("Your are connected to MongoDB");
    });
  } catch (err) {
    mongoose.connection.on("error", (err) => {
      console.log(err);
    });
  }
};

module.exports = connectToDB;
