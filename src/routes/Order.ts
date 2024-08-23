import { Router } from "express";
import { deleteOrder, deleteOrders, getOrder, getOrders, getOrdersAdmin, getOrdersByUser, getOrdersNotPayed, postOrder, searchOrders, updateOrder } from "../controllers/Order";
const router = Router();

router.get('/', getOrders);
router.get('/user/debt/:userid', getOrdersNotPayed);
router.get('/admin/attended', getOrdersAdmin);
router.get('/search/code/:idcode', searchOrders);
router.get('/search/code/user/:idcode/:userid', searchOrders);
router.get('/user/:userid', getOrdersByUser);
router.get('/:id', getOrder);
router.delete('/:id', deleteOrder);
router.delete('/:', deleteOrders);
router.post('/', postOrder);
router.patch('/:id', updateOrder);

export default router;