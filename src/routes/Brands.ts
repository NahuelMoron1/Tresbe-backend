import { Router } from "express";
import { deleteBrand, deleteBrands, getBrand, getBrands, postBrands, updateBrand } from "../controllers/Brands";
const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrand);
router.delete('/:id', deleteBrand);
router.delete('/:', deleteBrands);
router.post('/', postBrands);
router.patch('/:id', updateBrand);

export default router;