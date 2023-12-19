const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
const slugify = require("slugify");

exports.createNewCategory = async (req, res) => {
  const { title, slug, value } = req.body;

  if (!title || !value) {
    res.status(400).json({ message: "title and value are required" });
  }

  const existCategory = await Category.findOne({ title: title });
  if (existCategory) {
    res.status(400).json({ message: "The category title alredy existe" });
  }

  const category = await Category.create({
    title,
    value,
    slug: slugify(title).toLowerCase(),
  });

  if (category) {
    //created
    res.status(201).json({ message: `New category ${title} created` });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// find all caterories
exports.getCategories = async (req, res) => {
  const categories = await Category.find();

  if (categories) {
    res.status(200).json(categories);
    // res.status(200).json({ categories });
  } else {
    res.status(400).json({ message: "No category found" });
  }
};

// Single shop

exports.getSingleCategory = async (req, res) => {
  const { categorySlug } = req.params;
  const category = await Category.findById({ slug: categorySlug });
  const productsByCategory = await Product.find({
    category: category,
  }).populate({
    path: "category shop",
  });

  if (!category) {
    //created
    res.status(400).json({ message: "No shop found" });
  } else if (category && !productsByCategory) {
    res.status(201).json({ message: "No products in this category " });
  } else if (category && productsByCategory) {
    res.status(201).json({ category, productsByCategory });
  } else {
    res.status(400).json({ message: "There is an error" });
  }
};

// ATTENTION et DEMME POUR DELETE: A eviter parce les produits qui sont déjà dans cette categorie vont être introuvable
exports.updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ message: "Title is required" });
  }

  const category = await Category.findByIdAndUpdate(
    { _id: categoryId },
    { title, slug: slugify(title) }
  );
};
