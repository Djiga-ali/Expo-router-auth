const { createNewEvent } = require("../controllers/eventController");

const router = require("express").Router();

router.post("/create", createNewEvent);

module.exports = router;
