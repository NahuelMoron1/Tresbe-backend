import { Router } from "express";
import { deleteOrder, deleteOrders, getOrder, getOrders, getOrdersByUser, getOrdersNotPayed, postOrder, updateOrder } from "../controllers/Order";
const router = Router();

router.get('/', getOrders);
router.get('/user/debt/:userid', getOrdersNotPayed);
router.get('/user/:userid', getOrdersByUser);
router.get('/:id', getOrder);
router.delete('/:id', deleteOrder);
router.delete('/:', deleteOrders);
router.post('/', postOrder);
router.patch('/:id', updateOrder);

export default router;