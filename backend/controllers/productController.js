const User = require("../models/User");
const Shop = require("../models/Shop");
const Product = require("../models/Product");
const slugify = require("slugify");
const cloudinary = require("../config/cloudinary");

// pour search multicollection
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

exports.createNewProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    productLanguage,
    productType,
    productState,
    images: pictures,
  } = req.body;

  if (
    !name ||
    !category ||
    !price ||
    !productLanguage ||
    !productType ||
    !productState
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const userShop = await Shop.findOne({ owner: req.user._id });
  console.log("userShop:", userShop);

  // Cloudinary
  let images = [...req.body.images];

  // control number of images to upload and send error message
  if (images.length > 1) {
    res.status(400).json({ message: "Only 1 images are accepted" });
  }

  let imagesBuffer = [];
  // control number of images to upload
  if (images.length < 2) {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "images/products",
        width: 1920,
        crop: "scale",
      });

      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  req.body.images = imagesBuffer;
  // control number of images to upload when creating new image
  if (userShop && imagesBuffer.length !== 0) {
    const product = await Product.create({
      name,
      productStatus:
        userShop.shopStatus === "Subscriber"
          ? "Subscriber"
          : userShop.shopStatus === "Premium"
          ? "Premium"
          : "active",
      category,
      slug: slugify(
        userShop.shopName +
          "-" +
          "shop" +
          "-" +
          name +
          "-" +
          Math.random().toString(36).slice(2)
      ).toLowerCase(),
      price,
      productLanguage,
      productType,
      productState,
      shop: userShop._id,
      productCountry: userShop.country,
      pictures: imagesBuffer,
    });

    if (product) {
      //created
      res.status(201).json({ message: `New product ${product.name} created` });
    } else {
      res.status(400).json({ message: "There is an error" });
    }
  }
  // res.
};

// find all products

exports.allProducts = async (req, res) => {
  const products = await Product.find()
    .populate({ path: "category shop" })
    .exec();

  if (products) {
    res.status(200).json(products);
  } else {
    res.status(400).json({ message: "No product found" });
  }
};

// find products by shop public
exports.shopProducts = async (req, res) => {
  const { shopId } = req.params;
  const products = await Product.find({ shop: shopId })
    .populate({ path: "category shop" })
    .exec();

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find single product by shop public
exports.singleProduct = async (req, res) => {
  const { productSlug } = req.params;
  const product = await Product.findOne({ slug: productSlug })
    .populate({ path: "category shop" })
    .exec();
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    productType: product.productType,
    productStatus: product.productStatus,
    productLanguage: product.productLanguage,
    productCountry: product.productCountry,
  });

  if (!product) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (product) {
    res.status(201).json({ product, relatedProducts });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find products by shop protected
exports.sellerShopProducts = async (req, res) => {
  const { productLanguage, productType } = req.body;
  const products = await Product.find({ shop: req.user.shop._id })
    .populate({ path: "category shop" })
    .exec();
  // A vérifier ****************
  const productByLanguage = await Product.find({
    shop: req.user.shop._id,
    productLanguage,
  })
    .populate({ path: "category shop" })
    .exec();
  const productByType = await Product.find({
    shop: req.user.shop._id,
    productType,
  })
    .populate({ path: "category shop" })
    .exec();
  // Fin A vérifier ****************
  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    const test = products.shop;
    res.status(201).json({ products, productByLanguage, productByType });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find single product by protected
exports.sellerSingleProduct = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById({
    _id: productId,
    shop: req.user.shop._id,
  })
    .populate({ path: "category shop" })
    .exec();

  if (!product) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (product) {
    res.status(201).json({ product });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// update protected product
exports.updateProduct = async (req, res) => {
  const {
    productId,
    name,
    category,
    price,
    productLanguage,
    productType,
    productState,
    images: pictures,
  } = req.body;

  // const { productId } = req.params;
  // const { productId } = req.body;
  const product = await Product.findOne({
    _id: productId,
    shop: req.user.shop._id,
  });

  // const userShop = await Shop.findById({
  //   _id: req.user.shop._id,
  // });

  const userShop = req.user.shop;

  if (!product) {
    res.status(400).json({ message: "No product found" });
  } else {
    // Cloudinary

    let images = [...req.body.images];
    let imagesBuffer = [];

    // control number of images to upload and send error message
    if (images.length > 2) {
      res.status(400).json({ message: "Only 1 images are accepted" });
    }
    // control number of images to upload
    if (images.length !== 0 && images.length < 3) {
      const imgId = product.pictures;
      const pubilcId = imgId.map((pi) => pi.public_id);
      // console.log(pubilcId);
      if (pubilcId) {
        await cloudinary.api.delete_resources(
          pubilcId,
          function (error, result) {
            // console.log(result, error);
          }
        );
      }
    }

    // control number of images to upload
    if (images.length < 3) {
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: "images/products",
          width: 1920,
          crop: "scale",
        });

        imagesBuffer.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    req.body.images = imagesBuffer;
    // control number of images to upload when creating new image
    // if (userShop && imagesBuffer.length !== 0) {
    if (userShop && imagesBuffer.length !== 0) {
      const updatedProduct = await Product.findByIdAndUpdate(
        { _id: product._id },
        {
          name,
          productStatus:
            userShop.shopStatus === "Subscriber"
              ? "Subscriber"
              : userShop.shopStatus === "Premium"
              ? "Premium"
              : "active",
          category,
          slug: slugify(
            userShop.shopName +
              "-" +
              "shop" +
              "-" +
              name +
              "-" +
              Math.random().toString(36).slice(2)
          ).toLowerCase(),
          price,
          productLanguage,
          productType,
          productState,
          shop: userShop._id,
          productCountry: userShop.country,
          pictures: imagesBuffer,
        },
        { new: true }
      );

      const productUpdated = await Product.findById({
        _id: updatedProduct._id,
      });

      if (productUpdated) {
        res
          .status(201)
          .json({ message: `Product ${productUpdated.name} updated` });
      } else {
        res.status(400).json({ message: "There is an error" });
      }
    }
  }
};

// Delete single protected product
exports.deleteSingleProduct = async (req, res) => {
  const { productId } = req.body;
  const productToDelete = await Product.findOne({
    _id: productId,
    shop: req.user.shop._id,
  });

  if (productToDelete) {
    await Product.findOneAndDelete({
      _id: productToDelete._id,
      shop: req.user.shop._id,
    });

    res.status(201).json({ message: "Product deleted" });
  }

  if (!productToDelete) {
    res.status(400).json({ message: "No product found" });
  } else {
    res.status(400).json({ message: "Permission denied" });
  }
};

// Suspende Product
exports.suspendProduct = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById({ _id: productId }).populate("shop");
  const productShop = await Shop.findOne({ _id: product.shop._id });
  console.log("productShop:", productShop);

  await Product.findByIdAndUpdate(
    {
      _id: productId,
      shop: productShop,
    },
    { productStatus: "Suspended" }
  );

  res.status(201).json({ message: "Product Suspended " });
};

// unSuspende Product
exports.unSuspendProduct = async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById({ _id: productId }).populate("shop");
  const productShop = await Shop.findOne({ _id: product.shop._id });
  console.log("productShop:", productShop);

  await Product.findByIdAndUpdate(
    {
      _id: productId,
      shop: productShop,
    },
    {
      productStatus:
        productShop.shopStatus === "Suspended"
          ? "Suspended"
          : productShop.shopStatus === "Subscriber"
          ? "Subscriber"
          : productShop.shopStatus === "Premium"
          ? "Premium"
          : "active",
    }
  );

  res.status(201).json({ message: "Product unsuspended " });
};

// find products by category
exports.ProductCategory = async (req, res) => {
  const { categoryId } = req.body;
  const products = await Product.find({ category: categoryId }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find products by made in Burundi
exports.ProductMadeInBurundi = async (req, res) => {
  const products = await Product.find({ madeInBdi: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// find products by made in Kenya
exports.ProductMadeInKenya = async (req, res) => {
  const products = await Product.find({ madeInKy: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// find products by made in DRC
exports.ProductMadeInRdc = async (req, res) => {
  const products = await Product.find({ madeInRdc: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// find products by made in Rwanda
exports.ProductMadeInRwd = async (req, res) => {
  const products = await Product.find({ madeInRwd: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// find products by made in Tanzania
exports.ProductMadeInTz = async (req, res) => {
  const products = await Product.find({ madeInTz: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// find products by made in Uganda
exports.ProductMadeInUgd = async (req, res) => {
  const products = await Product.find({ madeInUgd: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// find products by made in South-sudan
exports.ProductMadeInSudan = async (req, res) => {
  const products = await Product.find({ madeInSudan: true }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find products by status
exports.ProductByStatus = async (req, res) => {
  const { productStatus } = req.body;
  const products = await Product.find({ productStatus }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find products by Type
exports.ProductByType = async (req, res) => {
  const { productType } = req.body;
  const products = await Product.find({ productType }).populate(
    "category",
    "title"
  );

  if (!products) {
    //created
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find products by productLanguage
exports.ProductByanguage = async (req, res) => {
  const { productLanguage } = req.body;
  const products = await Product.find({ productLanguage }).populate(
    "category",
    "title"
  );

  if (!products) {
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(201).json({ products });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// Search 6 ****
exports.searchProducts6 = async (req, res) => {
  const search = req.query.search;

  // const search2 = req.query.search2 || search;

  let sort = req.query.sort || "rating";
  const page = parseInt(req.query.page) - 1 || 0; // on veut que la valeur initail de la page soit "Zéro"
  const limit = req.query.limit || 2;

  // console.log("req.query.page:", req.query.page);
  // console.log("page:", page);

  // productState ***
  const stateOptions = ["new", "used", "usedAndNew"];
  // let productState = req.query.productState || "All";
  let productState = req.query.productState || "";

  // productState === ""
  //   ? // ? (productState = "new")
  //     (productState = [...stateOptions])
  //   : (productState = req.query.productState);
  // // : (productState = req.query.productState.split(","));

  productState
    ? (productState = req.query.productState.split(","))
    : productState === "" && (productState = [...stateOptions]);

  // product Type ****
  const typeOptions = ["physical", "digital"];
  // let productType = req.query.productType || "All";
  let productType = req.query.productType || "";

  // productType === ""
  //   ? // ? (productType = "physical")
  //     (productType = [...typeOptions])
  //   : (productType = req.query.productType);
  // // : (productType = req.query.productType.split(","));
  productType
    ? (productType = req.query.productType.split(","))
    : productType === "" && (productType = [...typeOptions]);

  // price
  const allPrices = await Product.find().select("price -_id");

  const mapedPrice = allPrices && allPrices?.map((p) => p.price);

  //Methods to find min/max elements of an array:
  //   Syntax:
  // minValue = Math.min(...array);
  // maxValue = Math.max(...array);

  const miniPrix = Math.min(...mapedPrice);
  // console.log("miniprix:", miniPrix);
  const maxPrix = Math.max(...mapedPrice);
  // console.log("maxprix:", maxPrix);

  const priceOptions = mapedPrice;

  // let price = req.query.price || "All";
  const price1 = req.query.price1 || miniPrix;
  const price2 = req.query.price2 || maxPrix;
  // const rangePrice = req.query.rangePrice;
  const rangePrice = [price1, price2];

  // console.log("rangePrice:", rangePrice);
  // console.log("rangePrice[0]:", rangePrice[0]);
  // console.log("rangePrice[1]:", rangePrice[1]);

  // end price

  // Users Filters

  // productState ***
  const countryOptions = ["Burundi", "Rwanda", "South Sudan"];
  // let productState = req.query.productState || "All";
  let country = req.query.country || "";

  country
    ? (country = req.query.country.split(","))
    : country === "" && (country = [...countryOptions]);
  // : (country = req.query.country);

  // country === ""
  //   ? // ? (country = "Burundi")
  //     (country = [...countryOptions])
  //   : (country = req.query.country);
  // // : (productState = req.query.productState);

  // product Type ****
  const optionsState = ["Bujumbura", "Kigali", "Juba"];
  // let productType = req.query.productType || "All";
  let state = req.query.state || "";

  // state === ""
  //   ? // ? (productType = "physical")
  //     (state = [...optionsState])
  //   : (state = req.query.state);

  state
    ? (state = req.query.state.split(","))
    : state === "" && (state = [...optionsState]);
  // : (productType = req.query.productType.split(","));
  // state === ""
  //   ? // ? (productType = "physical")
  //     (state = [...optionsState])
  //   : (state = req.query.state);
  // // : (productType = req.query.productType.split(","));

  const products = await Product.aggregate([
    {
      $search: {
        compound: {
          should: [
            {
              // https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/
              autocomplete: {
                query: search,
                path: "name",
              },
            },

            {
              autocomplete: {
                query: search,
                path: "productLanguage",
              },
            },
            {
              autocomplete: {
                query: search,
                path: "productCountry",
              },
            },
          ],
          filter: [
            {
              compound: {
                must: [
                  {
                    range: {
                      path: "price",
                      gte: parseInt(rangePrice[0]),
                      lte: parseInt(rangePrice[1]),
                    },
                  },

                  // NB : ne mmettez pas un field qui a été declaré en autocomplation  "autocomplete"
                  {
                    text: {
                      query: productState,
                      // query:  "new",
                      // query: ["new", "used"],
                      path: "productState",
                    },
                  },
                  {
                    text: {
                      query: productType,
                      // query:  "physical",
                      // query: ["physical", "digital"],
                      path: "productType",
                      // score: { constant: { value: 5 } },
                    },
                  },
                ],
              },
            },
          ],

          minimumShouldMatch: 1,
        },
      },
    },
    {
      $project: {
        // score: { $meta: "searchScore" },
        name: 1,
        productCountry: 1,
        productState: 1,
        productLanguage: 1,
        productType: 1,
        price: 1,
      },
    },
    {
      $addFields: {
        source: "products",
        source_count: "$$SEARCH_META.count.lowerBound",
      },
    },
    { $limit: 3 },
    {
      $unionWith: {
        coll: "events",
        // coll: "hotels",
        pipeline: [
          {
            $search: {
              compound: {
                should: [
                  {
                    // https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/
                    autocomplete: {
                      query: search,
                      path: "name",
                    },
                  },
                  // {
                  //   autocomplete: {
                  //     query: search,
                  //     path: "productLanguage",
                  //   },
                  // },
                  // {
                  //   autocomplete: {
                  //     query: search,
                  //     path: "productCountry",
                  //   },
                  // },
                ],
                filter: [
                  {
                    compound: {
                      must: [
                        // {
                        //   range: {
                        //     path: "price",
                        //     gte: parseInt(rangePrice[0]),
                        //     lte: parseInt(rangePrice[1]),
                        //   },
                        // },

                        // NB : ne mmettez pas un field qui a été declaré en autocomplation  "autocomplete"
                        {
                          text: {
                            query: country,
                            // query:  "new",
                            // query: ["new", "used"],
                            path: "country",
                          },
                        },
                        {
                          text: {
                            query: state,
                            path: "state",
                            // score: { constant: { value: 5 } },
                          },
                        },
                      ],
                    },
                  },
                ],

                minimumShouldMatch: 1,
              },
            },
          },
          {
            $project: {
              score: { $meta: "searchScore" },
              name: 1,
              price: 1,
              country: 1,
              state: 1,
              _id: 0,
            },
          },
          { $limit: 3 },
          {
            $set: {
              source: "events",
              source_count: "$$SEARCH_META.count.lowerBound",
            },
          },
          { $sort: { score: -1 } },
        ],
      },
    },
    {
      $unionWith: {
        // coll: "events",
        coll: "hotels",
        pipeline: [
          {
            $search: {
              compound: {
                should: [
                  {
                    // https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/
                    autocomplete: {
                      query: search,
                      path: "name",
                    },
                  },
                  // {
                  //   autocomplete: {
                  //     query: search,
                  //     path: "productLanguage",
                  //   },
                  // },
                  // {
                  //   autocomplete: {
                  //     query: search,
                  //     path: "productCountry",
                  //   },
                  // },
                ],
                filter: [
                  {
                    compound: {
                      must: [
                        // {
                        //   range: {
                        //     path: "price",
                        //     gte: parseInt(rangePrice[0]),
                        //     lte: parseInt(rangePrice[1]),
                        //   },
                        // },

                        // NB : ne mmettez pas un field qui a été declaré en autocomplation  "autocomplete"
                        {
                          text: {
                            query: country,
                            // query:  "new",
                            // query: ["new", "used"],
                            path: "country",
                          },
                        },
                        {
                          text: {
                            query: state,
                            path: "state",
                            // score: { constant: { value: 5 } },
                          },
                        },
                      ],
                    },
                  },
                ],

                minimumShouldMatch: 1,
              },
            },
          },
          {
            $project: {
              score: { $meta: "searchScore" },
              name: 1,
              price: 1,
              country: 1,
              state: 1,
              _id: 0,
            },
          },
          { $limit: 3 },
          {
            $set: {
              source: "hotels",
              // source_count: "$$SEARCH_META.count.lowerBound",
            },
          },
          { $sort: { score: -1 } },
        ],
      },
    },
    {
      $facet: {
        searchData: [{ $skip: page * limit }, { $limit: limit }],
        // totalResults: [{ $replaceWith: "$$SEARCH_META" }, { $limit: 1 }],
        // allDocs: [],
        totalCount: [
          {
            $group: {
              _id: "$source",
              firstCount: { $first: "$source_count" },
            },
          },
          {
            $project: {
              totalCount: { $sum: "$firstCount" },
            },
          },
        ],
      },
    },
  ]);

  const searchResults = {
    error: false,
    products,
    // total,
    // page: page + 1, // 0 + 1
    page: page,
    limit,
  };

  if (!searchResults) {
    res.status(400).json({ message: "No product found" });
  } else if (searchResults) {
    res.status(200).json(searchResults);
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// Search 5 ****
exports.searchProducts5 = async (req, res) => {
  const search = req.query.search;
  let sort = req.query.sort || "rating";
  const page = parseInt(req.query.page) - 1 || 0; // on veut que la valeur initail de la page soit "Zéro"
  const limit = req.query.limit || 2;

  // console.log("req.query.page:", req.query.page);
  // console.log("page:", page);

  // productState ***
  const stateOptions = ["new", "used"];
  let productState = req.query.productState || "All";

  productState === "All"
    ? (productState = [...stateOptions])
    : (productState = req.query.productState.split(","));

  // product Type ****
  const typeOptions = ["physical", "digital"];
  let productType = req.query.productType || "All";

  productType === "All"
    ? (productType = [...typeOptions])
    : (productType = req.query.productType.split(","));

  // price
  const allPrices = await Product.find().select("price -_id");

  const mapedPrice = allPrices && allPrices?.map((p) => p.price);

  //Methods to find min/max elements of an array:
  //   Syntax:
  // minValue = Math.min(...array);
  // maxValue = Math.max(...array);

  const miniPrix = Math.min(...mapedPrice);
  // console.log("miniprix:", miniPrix);
  const maxPrix = Math.max(...mapedPrice);
  // console.log("maxprix:", maxPrix);

  const priceOptions = mapedPrice;

  // let price = req.query.price || "All";
  const price1 = req.query.price1 || miniPrix;
  const price2 = req.query.price2 || maxPrix;
  // const rangePrice = req.query.rangePrice;
  const rangePrice = [price1, price2];

  // console.log("rangePrice:", rangePrice);
  // console.log("rangePrice[0]:", rangePrice[0]);
  // console.log("rangePrice[1]:", rangePrice[1]);

  // end price

  const products = await Product.aggregate([
    {
      $search: {
        // index: "text",

        compound: {
          should: [
            {
              // https://www.mongodb.com/docs/atlas/atlas-search/tutorial/autocomplete-tutorial/
              autocomplete: {
                query: search,
                path: "name",
              },
            },
            {
              autocomplete: {
                query: search,
                path: "productLanguage",
              },
            },
            {
              autocomplete: {
                query: search,
                path: "productCountry",
              },
            },
          ],
          filter: [
            {
              compound: {
                must: [
                  {
                    range: {
                      path: "price",
                      gte: parseInt(rangePrice[0]),
                      lte: parseInt(rangePrice[1]),
                    },
                  },

                  // NB : ne mmettez pas un field qui a été declaré en autocomplation  "autocomplete"
                  {
                    text: {
                      query: productState,
                      // query:  "new",
                      // query: ["new", "used"],
                      path: "productState",
                    },
                  },
                  {
                    text: {
                      query: productType,
                      // query:  "physical",
                      // query: ["physical", "digital"],
                      path: "productType",
                      score: { constant: { value: 5 } },
                    },
                  },
                ],
              },
            },
          ],

          minimumShouldMatch: 1,
        },
      },
    },
    // { $skip: page * limit },
    // { $limit: limit },
    { $sort: { createdAt: -1 } },

    {
      $project: {
        _id: 1,
        name: 1,
        productCountry: 1,
        productState: 1,
        productLanguage: 1,
        productType: 1,
        price: 1,
        // score: { $meta: "searchScore" },
      },
    },
    {
      $set: {
        score: { $meta: "searchScore" },
      },
    },
    {
      $facet: {
        // searchData: [],
        searchData: [{ $skip: page * limit }, { $limit: limit }],
        totalResults: [{ $replaceWith: "$$SEARCH_META" }, { $limit: 1 }],
      },
    },
    {
      $set: {
        totalResults: {
          $arrayElemAt: ["$totalResults", 0],
        },
      },
    },
  ]);

  // const total = products.length;

  const searchResults = {
    error: false,
    products,
    // total,
    // page: page + 1, // 0 + 1
    page: page,
    limit,
  };

  if (!searchResults) {
    res.status(400).json({ message: "No product found" });
  } else if (searchResults) {
    res.status(200).json(searchResults);
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// Search 4 ****
exports.searchProducts4 = async (req, res) => {
  const search = req.query.search || "";
  let sort = req.query.sort || "rating";
  const page = parseInt(req.query.page) - 1 || 0; // on veut que la valeur initail de la page soit "Zéro"
  const limit = parseInt(req.query.limit) || 2;

  const products = await Product.aggregate([
    {
      $search: {
        index: "text",
        compound: {
          should: [
            {
              autocomplete: {
                query: search,
                path: "name",
              },
            },
            {
              autocomplete: {
                query: search,
                path: "productLanguage",
              },
            },
            {
              autocomplete: {
                query: search,
                path: "productCountry",
              },
            },
          ],
          minimumShouldMatch: 1,
        },
      },
    },
    {
      $limit: limit,
    },
    { $skip: page * limit },
    {
      $project: {
        _id: 0,
        name: 1,
        productCountry: 1,
      },
    },
  ]);

  const total = products.length;

  const searchResults = {
    error: false,
    products,
    total,
    page: page + 1, // 0 + 1
    limit,
  };

  if (!searchResults) {
    res.status(400).json({ message: "No product found" });
  } else if (searchResults) {
    res.status(200).json(searchResults);
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// Search 3 *****
exports.searchProducts3 = async (req, res) => {
  const search = req.query.search || "";
  let sort = req.query.sort || "rating";
  const page = parseInt(req.query.page) - 1 || 0; // on veut que la valeur initail de la page soit "Zéro"
  const limit = parseInt(req.query.limit) || 5;
  // product Language ****
  const languageOptions = ["Kiswahili", "Kirundi"];
  let productLanguage = req.query.productLanguage || "All";

  productLanguage === "All"
    ? (productLanguage = [...languageOptions])
    : (productLanguage = req.query.productLanguage.split(","));

  // product Type ****
  const typeOptions = ["physical", "digital"];
  let productType = req.query.productType || "All";

  productType === "All"
    ? (productType = [...typeOptions])
    : (productType = req.query.productType.split(","));

  // productState ***
  const stateOptions = ["new", "used"];
  let productState = req.query.productState || "All";

  productState === "All"
    ? (productState = [...stateOptions])
    : (productState = req.query.productState.split(","));

  // product Country  **

  const countryOptions = [
    "Burundi",
    "Rwanda",
    "RDC",
    "Tanzania",
    "Kenya",
    "Uganda",
    "South Sudan",
  ];

  let productCountry = req.query.productCountry || "All";
  productCountry === "All"
    ? (productCountry = [...countryOptions])
    : (productCountry = req.query.productCountry.split(","));

  // price
  const allPrices = await Product.find().select("price -_id");

  const mapedPrice = allPrices && allPrices?.map((p) => p.price);

  //Methods to find min/max elements of an array:
  //   Syntax:
  // minValue = Math.min(...array);
  // maxValue = Math.max(...array);

  const miniPrix = Math.min(...mapedPrice);
  console.log("miniprix:", miniPrix);
  const maxPrix = Math.max(...mapedPrice);
  console.log("maxprix:", maxPrix);

  const priceOptions = mapedPrice;

  let price = req.query.price || "All";
  price === "All"
    ? (price = [...priceOptions])
    : (price = req.query.price.split(","));

  // end price

  // Sort
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }

  const products = await Product.find({
    $or: [
      // { first_name: { $regex: req.query.search, $options: "i" } },
      // { last_name: { $regex: req.query.search, $options: "i" } },
      { name: { $regex: search, $options: "i" } },
      { productCountry: { $regex: search, $options: "i" } },
      { productType: { $regex: search, $options: "i" } },
      { productState: { $regex: search, $options: "i" } },
      { productLanguage: { $regex: search, $options: "i" } },
      // { price: { $gte: miniPrix, $lte: maxPrix } },
    ],
  })
    .where("productCountry")
    .in([...productCountry])
    .where("productType")
    .in([...productType])
    .where("productState")
    .in([...productState])
    .where("productLanguage")
    .in([...productLanguage])
    .where("price")
    .in([...price])
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  const total = products.length;

  const searchResults = {
    error: false,
    products,
    total,
    page: page + 1, // 0 + 1
    limit,
    byCountry: countryOptions,
    byState: stateOptions,
    byType: typeOptions,
    byLanguage: languageOptions,
    byPrice: priceOptions,
  };

  if (!searchResults) {
    res.status(400).json({ message: "No product found" });
  } else if (searchResults) {
    res.status(200).json(searchResults);
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
// Search 2
exports.searchProducts2 = async (req, res) => {
  const search = req.query.search || "";
  let sort = req.query.sort || "rating";
  const page = parseInt(req.query.page) - 1 || 0; // on veut que la valeur initail de la page soit "Zéro"
  const limit = parseInt(req.query.limit) || 5;
  // product Language ****
  const languageOptions = ["Kiswahili", "Kirundi"];
  let productLanguage = req.query.productLanguage || "All";

  productLanguage === "All"
    ? (productLanguage = [...languageOptions])
    : (productLanguage = req.query.productLanguage.split(","));

  // product Type ****
  const typeOptions = ["physical", "digital"];
  let productType = req.query.productType || "All";

  productType === "All"
    ? (productType = [...typeOptions])
    : (productType = req.query.productType.split(","));

  // productState ***
  const stateOptions = ["new", "used"];
  let productState = req.query.productState || "All";

  productState === "All"
    ? (productState = [...stateOptions])
    : (productState = req.query.productState.split(","));

  // product Country  **

  const countryOptions = [
    "Burundi",
    "Rwanda",
    "RDC",
    "Tanzania",
    "Kenya",
    "Uganda",
    "South Sudan",
  ];

  let productCountry = req.query.productCountry || "All";
  productCountry === "All"
    ? (productCountry = [...countryOptions])
    : (productCountry = req.query.productCountry.split(","));

  // price
  const allPrices = await Product.find().select("price -_id");

  const mapedPrice = allPrices && allPrices?.map((p) => p.price);

  //Methods to find min/max elements of an array:
  //   Syntax:
  // minValue = Math.min(...array);
  // maxValue = Math.max(...array);

  const miniprix = Math.min(...mapedPrice);
  console.log("miniprix:", miniprix);
  const maxPrix = Math.max(...mapedPrice);
  console.log("maxprix:", maxPrix);

  const priceOptions = mapedPrice;

  let price = req.query.price || "All";
  price === "All"
    ? (price = [...priceOptions])
    : (price = req.query.price.split(","));

  // end price

  // Sort
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }

  const products = await Product.find({
    name: { $regex: search, $options: "i" },
    // price: { $gte: price1, $lte: price2 },
  })
    .where("productCountry")
    .in([...productCountry])
    .where("productType")
    .in([...productType])
    .where("productState")
    .in([...productState])
    .where("productLanguage")
    .in([...productLanguage])
    .where("price")
    .in([...price])
    .sort(sortBy)
    .skip(page * limit)
    .limit(limit);

  const total = await Product.countDocuments({
    name: { $regex: search, $options: "i" },
    productCountry: { $in: [...productCountry] },
    productType: { $in: [...productType] },
    productState: { $in: [...productState] },
    productLanguage: { $in: [...productLanguage] },
    price: { $in: [...priceOptions] },
  });

  const searchResults = {
    error: false,
    products,
    total,
    page: page + 1, // 0 + 1
    limit,
    byCountry: countryOptions,
    byState: stateOptions,
    byType: typeOptions,
    byLanguage: languageOptions,
    byPrice: priceOptions,
  };

  if (!searchResults) {
    res.status(400).json({ message: "No product found" });
  } else if (searchResults) {
    res.status(200).json(searchResults);
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// Search
exports.searchProducts = async (req, res) => {
  const search = req.query.search || "";
  const productLanguage = req.query.productLanguage || "";
  const productType = req.query.productType || "";
  const productState = req.query.productState || "";
  const productCountry = req.query.productCountry || "";
  // const priceFilter = req.query.priceFilter || [1, 50];
  const price1 = req.query.price1 || 1;
  const price2 = req.query.price2 || 10000000;

  const products = await Product.find({
    name: { $regex: search, $options: "i" },
    productCountry: { $regex: productCountry, $options: "i" },
    productState: { $regex: productState, $options: "i" },
    productLanguage: { $regex: productLanguage, $options: "i" },
    productType: { $regex: productType, $options: "i" },
    // price: { $gte: parseInt(priceFilter[0]), $lte: parseInt(priceFilter[1]) },
    price: { $gte: price1, $lte: price2 },
  }).sort({ price: 1 });
  // .limit(2);

  if (!products) {
    res.status(400).json({ message: "No product found" });
  } else if (products) {
    res.status(200).json(products);
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};
