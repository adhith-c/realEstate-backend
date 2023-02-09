const experss = require("express");

const router = experss();
const { getSaved, addToSaved } = require("../controllers/savedController");
const { verifyToken } = require("../middleware/verifyToken");

router.get("/", verifyToken, getSaved);
router.post("/addToSaved/:id", verifyToken, addToSaved);

module.exports = router;
