const express = require("express");
const {
  createNewProduct,
  sellerShopProducts,
  deleteSingleProduct,
  updateProduct,
  sellerSingleProduct,
  allProducts,
  singleProduct,
  shopProducts,
  suspendProduct,
  unSuspendProduct,
  ProductCategory,
  ProductMadeInBurundi,
  ProductMadeInKenya,
  ProductMadeInRdc,
  ProductMadeInRwd,
  ProductMadeInTz,
  ProductMadeInSudan,
  ProductStatus,
  ProductByStatus,
  ProductByType,
  searchProducts,
  searchProducts2,
  searchProducts3,
  searchProducts4,
  searchProducts5,
  searchProducts6,
} = require("../controllers/productController");
const {
  onlyLoginUserAccess,
  onlyAdmin,
  onlyManager,
} = require("../middlewares/forLoggedInUser");

const router = express.Router();

router.post("/create", onlyLoginUserAccess, createNewProduct);
router.get("/get-products", allProducts);
router.get("/search-products", searchProducts);
router.get("/search-products-2", searchProducts2);
router.get("/search-products-3", searchProducts3);
router.get("/search-products-4", searchProducts4);
router.get("/search-products-5", searchProducts5);
router.get("/search-products-6", searchProducts6);
router.get("/by-category", ProductCategory);
router.get("/by-made-in-burundi", ProductMadeInBurundi);
router.get("/by-made-in-rdc", ProductMadeInRdc);
router.get("/by-made-in-rwanda", ProductMadeInRwd);
router.get("/by-made-in-tanzania", ProductMadeInTz);
router.get("/by-made-in-sudan", ProductMadeInSudan);
router.get("/by-status", ProductByStatus);
router.get("/by-type", ProductByType);

router.get("/get-product/:productSlug", singleProduct);
router.get(
  "/get-seller-product/:productId",
  onlyLoginUserAccess,
  sellerSingleProduct
);

router.patch("/update-product", onlyLoginUserAccess, updateProduct);
router.patch(
  "/suspend-product",
  onlyLoginUserAccess,
  onlyManager,
  suspendProduct
);
router.patch(
  "/unsuspend-product",
  onlyLoginUserAccess,
  onlyManager,
  unSuspendProduct
);
router.delete("/delete-product", onlyLoginUserAccess, deleteSingleProduct);

router.get("/get-shop-products/:shopId", shopProducts);
router.get("/get-seller-products", onlyLoginUserAccess, sellerShopProducts);
module.exports = router;
