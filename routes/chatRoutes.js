const express = require("express");
const router = express();
//const { verifyToken } = require("../middleware/verifyToken");
const {
  userChats,
  createChat,
  findChat,
} = require("../controllers/chatController");

router.get("/:userId", userChats);
router.post("/", createChat);
router.get("/find/:firstId/:secondId", findChat);
// router.post("/register", register);
// router.post("/otpVerify", otpVerify);
// router.post("/resendOtp", resendOtp);
// router.post("/login", userLogin);
// router.post("/refresh", handleRefreshToken);
// router.put("/addProfilePhoto", addProfilePic);
// router.post("/editProfile", editProfile);

module.exports = router;
