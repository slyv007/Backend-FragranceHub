import express from 'express';
import { deleteOrder, getAllOrders, getOrderById, orderStatus, searchOrdersByDate } from '../controllers/order.js';

const router = express.Router();

router.put("/order-Status/:orderId", orderStatus)
router.get("/all", getAllOrders)
router.get("/:orderId", getOrderById)
router.delete("/:orderId", deleteOrder)
router.get("/search/term", searchOrdersByDate)

export default router;