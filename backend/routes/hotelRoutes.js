const router = require("express").Router();
const { createNewHotel } = require("../controllers/hotelController");

router.post("/create", createNewHotel);
module.exports = router;
