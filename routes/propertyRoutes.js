const experss = require("express");

const router = experss();
const {
  addProperty,
  getProperty,
  getSingleProperty,
  MyProperties,
  getPropertyChart,
  markSold,
} = require("../controllers/propertyController");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/addProperty", verifyToken, addProperty);
router.get("/", verifyToken, getProperty);
router.get("/myProperties", verifyToken, MyProperties);
router.get("/singleProperty/:id", verifyToken, getSingleProperty);
router.get("/propertyChart", getPropertyChart);
router.post("/markSold/:id", verifyToken, markSold);

module.exports = router;
