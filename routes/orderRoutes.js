const router = require("express").Router();

// const { protect } = require("../middleware/authMiddleware");
const auth = require("../middleware/authMiddleware");
// const validateOrder = require("../middleware/orderMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getAllOrders,
  ConfirmOrderStatus
} = require("../controllers/orderController");

router.post("/", auth, createOrder);
router.get("/my-orders", auth, getMyOrders);
router.put("/:id", auth, updateOrder);
router.delete("/:id", auth, deleteOrder);
router.put("/:id/confirm", auth, ConfirmOrderStatus);

// status and order view (admin only)
router.get("/all",auth,role("admin"),getAllOrders);
router.put("/:id/status",auth,role("admin"),updateOrderStatus);

module.exports = router;
