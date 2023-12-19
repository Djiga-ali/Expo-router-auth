const express = require("express");
const { onlyLoginUserAccess } = require("../middlewares/forLoggedInUser");
const {
  createNewShop,
  activateNewShop,
  getSingleShop,
  getSellerShop,
  updateSellerShop,
  deleteSellerShop,
  getShops,
  suspendSellerShop,
  unSuspendSellerShop,
  getShopsByCountry,
  getShopsByState,
  getShopsByCity,
  getShopsByShopType,
  getShopsByShopLanguge,
  getShopsByShopStatus,
} = require("../controllers/shopController");
const router = express.Router();

router.post("/create", onlyLoginUserAccess, createNewShop);
router.post("/activate", activateNewShop);
router.get("/get-shops", getShops);
router.get("/by-country", getShopsByCountry);
router.get("/by-state", getShopsByState);
router.get("/by-city", getShopsByCity);
router.get("/by-type", getShopsByShopType);
router.get("/by-language", getShopsByShopLanguge);
router.get("/by-status", getShopsByShopStatus);
router.get("/get-single-shop/:shopId", getSingleShop);
// router.get("/get-seller-shop/:shopId", onlyLoginUserAccess, getSellerShop);
// router.get("/get-seller-shop/", getSellerShop);
router.get("/get-seller-shop", onlyLoginUserAccess, getSellerShop);
router.patch(
  // "/update-seller-shop/:shopId",
  "/update-seller-shop",
  onlyLoginUserAccess,
  updateSellerShop
);
router.delete(
  "/delete-seller-shop",
  // "/delete-seller-shop/:shopId",
  onlyLoginUserAccess,
  deleteSellerShop
);
router.patch("/suspend-shop", onlyLoginUserAccess, suspendSellerShop);
router.patch("/unsuspend-shop", onlyLoginUserAccess, unSuspendSellerShop);

module.exports = router;
