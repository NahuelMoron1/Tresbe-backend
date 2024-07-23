import { Router } from "express";
import { deleteCartProduct, deleteCartProducts, getCartProduct, getCartProducts, getCartProductsByOrder, postCartProduct, updateCartProduct } from "../controllers/CartProducts";
const router = Router();

router.get('/', getCartProducts);
router.get('/:id', getCartProduct);
router.get('/order/:orderID', getCartProductsByOrder);
router.delete('/:id', deleteCartProduct);
router.delete('/:', deleteCartProducts);
router.post('/', postCartProduct);
router.patch('/:id', updateCartProduct);

export default router;