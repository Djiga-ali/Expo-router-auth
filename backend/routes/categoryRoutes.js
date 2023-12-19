const express = require("express");
const {
  createNewCategory,
  getCategories,
} = require("../controllers/categoryController");
const router = express.Router();

router.post("/create", createNewCategory);
router.get("/get-categories", getCategories);
module.exports = router;
