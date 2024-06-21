import { Router } from "express";
import { deleteOrderXproducts, deleteOrdersXproducts, getOrderXproducts, getOrdersXproducts, postOrderXproducts, updateOrderXproducts } from "../controllers/OrderXproducts";
const router = Router();

router.get('/', getOrdersXproducts);
router.get('/:id', getOrderXproducts);
router.delete('/:id', deleteOrderXproducts);
router.delete('/:', deleteOrdersXproducts);
router.post('/', postOrderXproducts);
router.patch('/:id', updateOrderXproducts);

export default router;