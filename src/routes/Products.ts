import { Router } from "express";
import { getProducts, getProduct, deleteProduct, postProduct, updateProduct, deleteProducts, getProductsByBrands, getProductsByCategory, getProductsBySearch, getRandomProducts } from "../controllers/Products";
const router = Router();

router.get('/', getProducts);
router.get('/random', getRandomProducts);
router.get('/:id', getProduct);
router.get('/brand/:brand', getProductsByBrands);
router.get('/category/:category', getProductsByCategory);
router.get('/search/:name/:brand', getProductsBySearch);
router.delete('/:id', deleteProduct);
router.delete('/:', deleteProducts);
router.post('/', postProduct);
router.patch('/:id', updateProduct);

export default router;