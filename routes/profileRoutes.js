const express = require("express");
const router = express();
const { verifyToken } = require("../middleware/verifyToken");
const {
  getProfile,
  postProfile,
  editProfile,
  changeEmail,
  verifyOtp,
} = require("../controllers/profileController");

router.get("/", verifyToken, getProfile);
router.post("/", verifyToken, postProfile);

router.post("/editProfile", editProfile);

module.exports = router;
