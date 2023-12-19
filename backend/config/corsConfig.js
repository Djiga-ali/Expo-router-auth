const corsOrigins = require("./corsOrigins");

const corsConfig = {
  origin: (origin, callback) => {
    if (corsOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Cors not allowed"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsConfig;
