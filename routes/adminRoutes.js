const express = require("express");
const router = express();

const {
  getAdminLogin,
  postAdminLogin,
  userDetails,
  banners,
  addBanners,
  blockUnblockUser,
  getUserCount,
  getPropertyCount,
  getChatCount,
} = require("../controllers/adminController");
router.get("/login", getAdminLogin);
router.post("/login", postAdminLogin);
router.get("/userDetails", userDetails);
router.get("/banners", banners);
router.post("/addBanner", addBanners);
router.get("/blockunblock/:id", blockUnblockUser);
router.get("/getUserCount", getUserCount);
router.get("/getPropertyCount", getPropertyCount);
router.get("/getChatCount", getChatCount);

module.exports = router;
