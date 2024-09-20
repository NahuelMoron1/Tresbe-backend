import { Router } from "express";
import { deleteOrderXproducts, deleteOrderXproductsByIDs, deleteOrdersXproducts, getOrderXproducts, getOrdersXproducts, getOxpByOrders, postOrderXproducts, updateOrderXproducts } from "../controllers/OrderXproducts";
const router = Router();

router.get('/', getOrdersXproducts);
router.get('/orders/:orderid', getOxpByOrders);
router.get('/:id', getOrderXproducts);
router.delete('/:id', deleteOrderXproducts);
router.delete('/products/:productID/:orderID', deleteOrderXproductsByIDs);
router.delete('/:', deleteOrdersXproducts);
router.post('/', postOrderXproducts);
router.patch('/:id', updateOrderXproducts);

export default router;