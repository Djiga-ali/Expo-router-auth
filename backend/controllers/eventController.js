const Event = require("../models/Event");

exports.createNewEvent = async (req, res) => {
  const {
    name,
    price,
    discountPrice,
    country,
    state,
    type,
    productState,
    productType,
  } = req.body;

  const event = await Event.create({
    name,
    price,
    discountPrice,
    country,
    state,
    type,
    productState,
    productType,
  });
  res.status(201).json(event);
};
