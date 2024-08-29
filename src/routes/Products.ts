import { Router } from "express";
import { getProducts, getProduct, deleteProduct, postProduct, updateProduct, deleteProducts, getProductsByBrands, getProductsByCategory, getProductsBySearch, getRandomProducts, countPages } from "../controllers/Products";
const router = Router();

router.get('/page/:page', getProducts);
router.get('/count/:type/:brand', countPages);
router.get('/random', getRandomProducts);
router.get('/:id', getProduct);
router.get('/brand/:brand/:page', getProductsByBrands);
router.get('/category/:category/:page', getProductsByCategory);
router.get('/search/:name/:value/:type', getProductsBySearch);
router.delete('/:id', deleteProduct);
router.delete('/:', deleteProducts);
router.post('/', postProduct);
router.patch('/:id', updateProduct);

export default router;