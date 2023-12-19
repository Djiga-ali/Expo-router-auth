const Hotel = require("../models/hotel");

exports.createNewHotel = async (req, res) => {
  const { name, desc, country, state, type, productState, productType, price } =
    req.body;

  const hotel = await Hotel.create({
    name,
    desc,
    country,
    state,
    type,
    productState,
    productType,
    price,
  });
  res.status(201).json(hotel);
};
