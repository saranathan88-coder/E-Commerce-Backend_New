console.log("Product Routes Loaded");
const router = require("express").Router();
const upload = require("../middleware/upload");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  addReview,
  getProductById,
} = require("../controllers/productController");

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProduct);
// router.post("/", upload.single("image"), auth, role("admin"), createProduct);
router.post("/", upload.array("images",10), auth, role("admin"), createProduct);
router.put("/:id",auth,role("admin"), upload.array("images", 10),updateProduct);
router.delete("/:id", auth, role("admin"), deleteProduct);
router.post("/:productId/reviews", auth, addReview);

module.exports = router;
